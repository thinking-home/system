using System.IO.Compression;
using System.Net;
using System.Text;
using System.Text.Json;
using NuGet.Versioning;
using ThinkingHome.PackageSources;
using ThinkingHome.Repository;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class SourceTests(PackageFixture fixture) : IClassFixture<PackageFixture> {
    private string Folder() {
        var folder = Path.Combine(fixture.Work, Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(folder);
        return folder;
    }

    [Fact]
    public async Task Repository_RoundTripsPluginOverHttp_AndSupportsHeadAndNuspec() {
        var folder = Folder();
        File.Copy(fixture.Good, Path.Combine(folder, "plugin.nupkg"));
        await using var app = RepositoryServer.Create(folder, "http://127.0.0.1:0");
        await app.StartAsync();
        try {
            var address = app.Urls.Single();
            using var http = new HttpClient(new HttpClientHandler { UseProxy = false });
            var source = address + "/v3/index.json";
            var client = new NuGetSourceClient(http, new() { PluginSources = [source] });
            var listing = await client.FindAsync(PackageKind.Plugin, "Fixture.Good");
            Assert.Single(listing.Versions);
            var downloaded = await client.DownloadAsync(PackageKind.Plugin, "Fixture.Good", NuGetVersion.Parse("1.2.3-beta.1"));
            Assert.Equal(File.ReadAllBytes(fixture.Good), downloaded.Bytes);
            Assert.NotNull(downloaded.Metadata.Plugin);
            Assert.Equal(new Uri(source), downloaded.Source);
            using var head = await http.SendAsync(new HttpRequestMessage(HttpMethod.Head,
                address + "/v3/flat/fixture.good/1.2.3-beta.1/fixture.good.1.2.3-beta.1.nupkg"));
            Assert.Equal(HttpStatusCode.OK, head.StatusCode);
            Assert.Empty(await head.Content.ReadAsByteArrayAsync());
            Assert.NotNull(head.Headers.ETag);
            Assert.Contains("Fixture.Good", await http.GetStringAsync(address + "/v3/flat/fixture.good/1.2.3-beta.1/fixture.good.nuspec"));
            Assert.Equal(HttpStatusCode.NotFound, (await http.GetAsync(address + "/v3/flat/missing/index.json")).StatusCode);
            // Изменение исходного файла не меняет уже обслуживаемый снимок.
            File.WriteAllText(Path.Combine(folder, "plugin.nupkg"), "changed");
            Assert.Equal(downloaded.Bytes, (await client.DownloadAsync(PackageKind.Plugin, "Fixture.Good", NuGetVersion.Parse("1.2.3-beta.1"))).Bytes);
        } finally { await app.StopAsync(); }
    }

    [Fact]
    public void Repository_RejectsChangedPublishedVersion_AfterRestart() {
        var folder = Folder();
        var path = Path.Combine(folder, "plugin.nupkg");
        File.Copy(fixture.Good, path);
        using (var catalog = new RepositoryCatalog(folder)) Assert.Single(catalog.Packages);
        using (var archive = ZipFile.Open(path, ZipArchiveMode.Update)) archive.CreateEntry("changed.txt");
        Assert.Contains("Published version changed", Assert.Throws<InvalidDataException>(() => new RepositoryCatalog(folder)).Message);
        // Неудачное индексирование освобождает блокировку и не портит журнал.
        File.Copy(fixture.Good, path, overwrite: true);
        using var restored = new RepositoryCatalog(folder);
        Assert.Single(restored.Packages);
    }

    [Fact]
    public void Repository_IgnoresStagingDirectories_AndRejectsOrdinaryLibrary() {
        var folder = Folder();
        Directory.CreateDirectory(Path.Combine(folder, ".staging"));
        File.WriteAllText(Path.Combine(folder, ".staging", "broken.nupkg"), "invalid");
        using (var catalog = new RepositoryCatalog(folder)) Assert.Empty(catalog.Packages);
        File.WriteAllBytes(Path.Combine(folder, "ordinary.nupkg"), OrdinaryPackage());
        Assert.Contains("not a ThinkingHome plugin", Assert.Throws<InvalidDataException>(() => new RepositoryCatalog(folder)).Message);
    }

    [Fact]
    public async Task Client_SeparatesSources_AndDownloadsOrdinaryNuGetPackage() {
        using var handler = new FeedHandler(File.ReadAllBytes(fixture.Good), OrdinaryPackage());
        using var http = new HttpClient(handler);
        var client = new NuGetSourceClient(http, Configuration());
        var library = await client.DownloadAsync(PackageKind.Library, "Example.Library", NuGetVersion.Parse("1.0.0"));
        Assert.Null(library.Metadata.Plugin);
        Assert.All(handler.Requests, x => Assert.Equal("library.test", x.Host));
        handler.Requests.Clear();
        await Assert.ThrowsAsync<KeyNotFoundException>(() => client.FindAsync(PackageKind.Plugin, "Example.Library"));
        Assert.All(handler.Requests, x => Assert.Equal("plugin.test", x.Host));
    }

    [Fact]
    public async Task Client_RejectsOrdinaryPackage_FromPluginSource() {
        using var handler = new FeedHandler(OrdinaryPackage(), OrdinaryPackage()) { PluginId = "example.library", PluginVersion = "1.0.0" };
        using var http = new HttpClient(handler);
        await Assert.ThrowsAsync<InvalidDataException>(() => new NuGetSourceClient(http, Configuration())
            .DownloadAsync(PackageKind.Plugin, "Example.Library", NuGetVersion.Parse("1.0.0")));
    }

    [Fact]
    public async Task Client_UsesConfiguredPriority_AndDetectsConflictingContent() {
        var bytes = File.ReadAllBytes(fixture.Good);
        using var handler = new FeedHandler(bytes, bytes);
        using var http = new HttpClient(handler);
        var client = new NuGetSourceClient(http, new() { PluginSources = ["http://plugin.test/v3/index.json", "http://other.test/v3/index.json"] });
        var selected = await client.DownloadAsync(PackageKind.Plugin, "Fixture.Good", NuGetVersion.Parse("1.2.3-beta.1"));
        Assert.Equal("plugin.test", selected.Source.Host);
        handler.OtherPackage = File.ReadAllBytes(fixture.Mutate(zip => zip.CreateEntry("different.txt")));
        Assert.Contains("Conflicting content", (await Assert.ThrowsAsync<InvalidDataException>(() =>
            client.DownloadAsync(PackageKind.Plugin, "Fixture.Good", NuGetVersion.Parse("1.2.3-beta.1")))).Message);
    }

    [Fact]
    public async Task Client_FallsThroughOnlyOnMissingPackage_NotOnServerFailure() {
        using var handler = new FeedHandler(File.ReadAllBytes(fixture.Good), OrdinaryPackage()) { MissingFirst = true };
        using var http = new HttpClient(handler);
        var client = new NuGetSourceClient(http, new() { PluginSources = ["http://plugin.test/v3/index.json", "http://other.test/v3/index.json"] });
        Assert.Equal("other.test", (await client.FindAsync(PackageKind.Plugin, "Fixture.Good")).Source.Host);
        handler.FailFirst = true;
        handler.Requests.Clear();
        await Assert.ThrowsAsync<HttpRequestException>(() => client.FindAsync(PackageKind.Plugin, "Fixture.Good"));
        Assert.DoesNotContain(handler.Requests, x => x.Host == "other.test");
    }

    [Fact]
    public async Task Client_RejectsWrongIdentity_AndDoesNotCreateOutput() {
        using var handler = new FeedHandler(File.ReadAllBytes(fixture.Good), OrdinaryPackage()) { PluginId = "another.plugin" };
        using var http = new HttpClient(handler);
        var output = Path.Combine(Folder(), "downloads");
        await Assert.ThrowsAsync<InvalidDataException>(() => new NuGetSourceClient(http, Configuration())
            .DownloadToAsync(PackageKind.Plugin, "Another.Plugin", NuGetVersion.Parse("1.2.3-beta.1"), output));
        Assert.False(Directory.Exists(output));
    }

    [Fact]
    public async Task Client_NormalizesVersion_AndSavesWithoutOverwriting() {
        using var handler = new FeedHandler(File.ReadAllBytes(fixture.Good), OrdinaryPackage());
        using var http = new HttpClient(handler);
        var client = new NuGetSourceClient(http, Configuration());
        var output = Folder();
        var file = await client.DownloadToAsync(PackageKind.Library, "EXAMPLE.LIBRARY", NuGetVersion.Parse("1.0.0.0+build"), output);
        Assert.Equal("example.library.1.0.0.nupkg", Path.GetFileName(file));
        var bytes = File.ReadAllBytes(file);
        await Assert.ThrowsAsync<IOException>(() => client.DownloadToAsync(PackageKind.Library, "Example.Library", NuGetVersion.Parse("1.0"), output));
        Assert.Equal(bytes, File.ReadAllBytes(file));
        Assert.Single(Directory.GetFiles(output));
    }

    [Fact]
    public async Task Client_DoesNotSearchLowerPrioritySource_ForMissingVersion() {
        using var handler = new FeedHandler(File.ReadAllBytes(fixture.Good), OrdinaryPackage());
        using var http = new HttpClient(handler);
        var client = new NuGetSourceClient(http, new() { PluginSources = ["http://plugin.test/v3/index.json", "http://other.test/v3/index.json"] });
        await Assert.ThrowsAsync<KeyNotFoundException>(() => client.DownloadAsync(PackageKind.Plugin, "Fixture.Good", NuGetVersion.Parse("99.0.0")));
        Assert.DoesNotContain(handler.Requests, x => x.Host == "other.test");
    }

    [Fact]
    public void Configuration_RejectsUnknownFields_AndNonHttpSource() {
        var path = Path.Combine(Folder(), "sources.json");
        File.WriteAllText(path, "{\"pluginSource\": []}");
        Assert.Throws<JsonException>(() => SourceConfiguration.Read(path));
        Assert.Throws<InvalidDataException>(() => new SourceConfiguration { PluginSources = ["file:///tmp/packages"] }.GetSources(PackageKind.Plugin));
    }

    private static SourceConfiguration Configuration() => new() {
        PluginSources = ["http://plugin.test/v3/index.json"], LibrarySources = ["http://library.test/v3/index.json"]
    };

    private static byte[] OrdinaryPackage() {
        using var buffer = new MemoryStream();
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Create, leaveOpen: true)) {
            using var writer = new StreamWriter(zip.CreateEntry("example.nuspec").Open());
            writer.Write("<package><metadata><id>Example.Library</id><version>1.0.0</version><authors>test</authors><description>test</description></metadata></package>");
        }
        return buffer.ToArray();
    }

    private sealed class FeedHandler(byte[] plugin, byte[] library) : HttpMessageHandler {
        private readonly byte[] pluginPackage = plugin;
        public List<Uri> Requests { get; } = [];
        public byte[] OtherPackage { get; set; } = plugin;
        public string PluginId { get; init; } = "fixture.good";
        public string PluginVersion { get; init; } = "1.2.3-beta.1";
        public bool MissingFirst { get; init; }
        public bool FailFirst { get; set; }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken) {
            var uri = request.RequestUri!;
            Requests.Add(uri);
            var isLibrary = uri.Host == "library.test";
            var id = isLibrary ? "example.library" : PluginId;
            var version = isLibrary ? "1.0.0" : PluginVersion;
            HttpResponseMessage Json(object value) => new(HttpStatusCode.OK) {
                Content = new StringContent(JsonSerializer.Serialize(value), Encoding.UTF8, "application/json")
            };
            if (FailFirst && uri.Host == "plugin.test") return Task.FromResult(new HttpResponseMessage(HttpStatusCode.ServiceUnavailable));
            if (uri.AbsolutePath == "/v3/index.json") return Task.FromResult(Json(new {
                version = "3.0.0", resources = new[] { new Dictionary<string, string> {
                    ["@id"] = $"http://{uri.Host}/flat/", ["@type"] = "PackageBaseAddress/3.0.0"
                } }
            }));
            if (MissingFirst && uri.Host == "plugin.test") return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
            if (uri.AbsolutePath == $"/flat/{id}/index.json") return Task.FromResult(Json(new { versions = new[] { version } }));
            if (uri.AbsolutePath == $"/flat/{id}/{version}/{id}.{version}.nupkg") return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new ByteArrayContent(isLibrary ? library : uri.Host == "other.test" ? OtherPackage : pluginPackage)
            });
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.NotFound));
        }
    }
}
