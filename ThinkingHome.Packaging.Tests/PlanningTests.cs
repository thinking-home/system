using System.IO.Compression;
using System.Reflection;
using System.Xml.Linq;
using NuGet.Versioning;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;
using ThinkingHome.Repository;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class PlanningTests(PackageFixture fixture) : IClassFixture<PackageFixture> {
    private PlanRequest Request(params (string Id, string Range)[] roots) => new("net10.0", "win-x64",
        roots.Select(x => new RootPlugin(x.Id, x.Range)).ToArray());

    private PlatformCatalog Platform(string rid = "win-x64") {
        var input = PackageFixture.Inputs(fixture.Good);
        var platformIds = File.ReadAllLines(Path.Combine(input, "platform.txt")).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var references = File.ReadAllLines(Path.Combine(input, "ownership.txt")).Select(x => x.Split('|'))
            .Where(x => platformIds.Contains(x[1]) || x[2].Contains("ThinkingHome.Core.Plugins") || x[3].Length > 0)
            .Select(x => x[0]);
        var bclDirectory = Path.GetDirectoryName(typeof(object).Assembly.Location);
        var runtime = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!).Split(Path.PathSeparator)
            .Where(x => Path.GetDirectoryName(x) == bclDirectory);
        var assemblies = references.Concat(runtime).GroupBy(x => AssemblyName.GetAssemblyName(x).Name).Select(x => x.Last()).ToArray();
        return new("4.0.0-alpha34", "net10.0", rid, platformIds.ToDictionary(x => x,
            x => x == "ThinkingHome.Core.Plugins" ? "4.0.0-alpha34" : "10.0.11"), assemblies);
    }

    private byte[] Dependency(string version = "1.0.0", params (string Id, string Range)[] dependencies) => Library("Fixture.Dependency", version,
        File.ReadAllBytes(Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests/Fixtures/Dependency/bin/Release/net10.0/Vendor.Dependency.dll")), dependencies);

    private static byte[] Library(string id, string version, byte[]? dll = null, params (string Id, string Range)[] dependencies) {
        using var buffer = new MemoryStream();
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Create, true)) {
            using (var stream = zip.CreateEntry(id + ".nuspec").Open())
                new XDocument(new XElement("package", new XElement("metadata", new XElement("id", id), new XElement("version", version),
                    new XElement("dependencies", new XElement("group", new XAttribute("targetFramework", "net10.0"), dependencies.Select(x =>
                        new XElement("dependency", new XAttribute("id", x.Id), new XAttribute("version", x.Range)))))))).Save(stream);
            if (dll != null) { using var stream = zip.CreateEntry("lib/net10.0/Vendor.Dependency.dll").Open(); stream.Write(dll); }
        }
        return buffer.ToArray();
    }

    private static byte[] ChangeDependencies(byte[] bytes, params (string Id, string Range)[] dependencies) {
        using var buffer = new MemoryStream();
        buffer.Write(bytes);
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Update, true)) {
            var entry = zip.Entries.Single(x => x.FullName.EndsWith(".nuspec"));
            XDocument xml;
            using (var input = entry.Open()) xml = XDocument.Load(input);
            var group = xml.Descendants().Single(x => x.Name.LocalName == "group");
            foreach (var dependency in dependencies) {
                var existing = group.Elements().SingleOrDefault(x => x.Attribute("id")?.Value == dependency.Id);
                if (existing != null) existing.SetAttributeValue("version", dependency.Range);
                else group.Add(new XElement(group.Name.Namespace + "dependency", new XAttribute("id", dependency.Id), new XAttribute("version", dependency.Range)));
            }
            var name = entry.FullName;
            entry.Delete();
            using var output = zip.CreateEntry(name).Open();
            xml.Save(output);
        }
        return buffer.ToArray();
    }

    private static byte[] AddFiles(byte[] bytes, params (string Path, byte[] Bytes)[] files) {
        using var buffer = new MemoryStream();
        buffer.Write(bytes);
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Update, true)) {
            foreach (var file in files) { using var output = zip.CreateEntry(file.Path).Open(); output.Write(file.Bytes); }
        }
        return buffer.ToArray();
    }

    [Fact]
    public async Task Plan_ValidatesRealPlugin_AndProducesDeterministicBoundMap() {
        var source = new MemorySource(File.ReadAllBytes(fixture.Good), Dependency());
        var planner = new PackagePlanner(source);
        var request = Request(("Fixture.Good", "[1.2.3-beta.1]"));
        var first = await planner.PlanAsync(request, Platform());
        var second = await planner.PlanAsync(request, Platform());
        Assert.Equal(2, first.Lock.Packages.Length);
        Assert.Equal(PlanJson.Bytes(first), PlanJson.Bytes(second));
        Assert.Equal(PlanJson.Hash(PlanJson.Bytes(first.Lock)), first.LoadMap.LockSha512);
        Assert.Contains(first.LoadMap.Assets, x => x.Name == "Vendor.Dependency" && x.Owner == "plugin:fixture.good");
        Assert.DoesNotContain(fixture.Root, System.Text.Encoding.UTF8.GetString(PlanJson.Bytes(first)));
        Assert.DoesNotContain(AppDomain.CurrentDomain.GetAssemblies(), x => x.GetName().Name == "Good");
    }

    [Fact]
    public async Task Plan_KeepsPrivateVersionsSeparate_AndDeduplicatesSamePackage() {
        var graph = File.ReadAllBytes(fixture.Build("Graph", "graph-private"));
        var good = File.ReadAllBytes(fixture.Good);
        var source = new MemorySource(ChangeDependencies(good, ("Fixture.Dependency", "[1.0.0]")),
            ChangeDependencies(graph, ("Fixture.Dependency", "[2.0.0]")), Dependency(), Dependency("2.0.0"));
        var request = Request(("Fixture.Good", "[1.2.3-beta.1]"), ("Fixture.Graph", "[1.0.0]"));
        var result = await new PackagePlanner(source).PlanAsync(request, Platform());
        Assert.Equal(2, result.Lock.Packages.Count(x => x.Id == "Fixture.Dependency"));
        Assert.Equal(2, result.LoadMap.Assets.Where(x => x.Name == "Vendor.Dependency").Select(x => x.Owner).Distinct().Count());
        var same = await new PackagePlanner(new MemorySource(good, graph, Dependency())).PlanAsync(request, Platform());
        Assert.Single(same.Lock.Packages, x => x.Id == "Fixture.Dependency");
        Assert.Equal(2, same.LoadMap.Assets.Count(x => x.Name == "Vendor.Dependency"));
        Assert.Contains(same.LoadMap.Assets, x => x.Kind == "resource" && x.Name == "Graph.resources" && x.Culture == "ru");
    }

    [Fact]
    public async Task Plan_RejectsPrivateTypeLeak_AgainstSelectedDependencies() {
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(new MemorySource(File.ReadAllBytes(fixture.Bad), Dependency()))
            .PlanAsync(Request(("Fixture.Bad", "[1.0.0]")), Platform()));
        Assert.Contains("private dependency", error.Message);
    }

    [Fact]
    public async Task Plan_SharesContracts_ButAllowsIndependentPrivateVersion() {
        var source = new MemorySource(ChangeDependencies(File.ReadAllBytes(fixture.Shared), ("Fixture.Dependency", "[1.0.0]")),
            ChangeDependencies(File.ReadAllBytes(fixture.Good), ("Fixture.Dependency", "[2.0.0]")), Dependency(), Dependency("2.0.0"));
        var result = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Bad", "[1.0.0]"), ("Fixture.Good", "[1.2.3-beta.1]")), Platform());
        Assert.Contains(result.LoadMap.Assets, x => x.Scope == "plugin:fixture.bad" && x.Name == "Vendor.Dependency" && x.Owner == "shared");
        Assert.Contains(result.LoadMap.Assets, x => x.Scope == "plugin:fixture.good" && x.Name == "Vendor.Dependency" && x.Owner == "plugin:fixture.good");
    }

    [Fact]
    public async Task Plan_ReportsSharedVersionConflict_WithBothChains() {
        var graph = fixture.Build("Graph", "graph-shared", "-p:DependencyKind=shared");
        var source = new MemorySource(ChangeDependencies(File.ReadAllBytes(fixture.Shared), ("Fixture.Dependency", "[1.0.0]")),
            ChangeDependencies(File.ReadAllBytes(graph), ("Fixture.Dependency", "[2.0.0]")), Dependency(), Dependency("2.0.0"));
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(source)
            .PlanAsync(Request(("Fixture.Bad", "[1.0.0]"), ("Fixture.Graph", "[1.0.0]")), Platform()));
        Assert.Contains("Fixture.Bad", error.Message);
        Assert.Contains("Fixture.Graph", error.Message);
    }

    [Fact]
    public async Task Plan_BacktracksToOlderVersion_WhenTransitiveRequirementsConflict() {
        var good = ChangeDependencies(File.ReadAllBytes(fixture.Good), ("Fixture.Dependency", "[1.0.0,3.0.0)"));
        var source = new MemorySource(good, Dependency("2.0.0", ("Missing.Package", "[1.0.0]")), Dependency());
        var result = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform());
        Assert.Equal("1.0.0", result.Lock.Packages.Single(x => x.Id == "Fixture.Dependency").Version);
    }

    [Fact]
    public async Task Plan_ImportsPluginFromItsOwner_AndOrdersDependenciesFirst() {
        var graph = fixture.Build("Graph", "graph-peer", "-p:PeerId=Fixture.Good");
        var source = new MemorySource(ChangeDependencies(File.ReadAllBytes(graph), ("Fixture.Good", "[1.2.3-beta.1]")),
            File.ReadAllBytes(fixture.Good), Dependency());
        var result = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Graph", "[1.0.0]")), Platform());
        Assert.Equal(new[] { "plugin:fixture.good", "plugin:fixture.graph" }, result.Lock.PluginOrder);
        Assert.Contains(result.LoadMap.Assets, x => x.Scope == "plugin:fixture.graph" && x.Name == "Good" && x.Owner == "plugin:fixture.good");
        Assert.DoesNotContain(result.LoadMap.Assets, x => x.Scope == "plugin:fixture.graph" && x.Name == "Vendor.Dependency" && x.Owner == "plugin:fixture.good");
    }

    [Fact]
    public async Task Plan_RejectsPluginCycles() {
        var graph = fixture.Build("Graph", "graph-cycle", "-p:PeerId=Fixture.Graph");
        var source = new MemorySource(ChangeDependencies(File.ReadAllBytes(graph), ("Fixture.Graph", "[1.0.0]")), Dependency());
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(source).PlanAsync(Request(("Fixture.Graph", "[1.0.0]")), Platform()));
        Assert.Contains("cycle", error.Message);
    }

    [Fact]
    public async Task Plan_RejectsLibraryRoot_AndIncompatiblePlatform() {
        var source = new MemorySource(File.ReadAllBytes(fixture.Good), Dependency());
        await Assert.ThrowsAsync<InvalidDataException>(() => new PackagePlanner(source).PlanAsync(Request(("Fixture.Dependency", "[1.0.0]")), Platform()));
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(source).PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform() with { Version = "3.0.0" }));
        Assert.Contains("platform", error.Message);
        var floating = ChangeDependencies(File.ReadAllBytes(fixture.Good), ("ThinkingHome.Core.Plugins", "3.*"));
        error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(new MemorySource(floating, Dependency()))
            .PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform()));
        Assert.Contains("does not satisfy", error.Message);
    }

    [Fact]
    public async Task Plan_HandlesEmbeddedLibrary_AndTargetSpecificLock() {
        var source = new MemorySource(File.ReadAllBytes(fixture.Embedded));
        var result = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Embedded", "[1.0.0]")), Platform());
        Assert.Single(result.Lock.Packages);
        Assert.Contains(result.LoadMap.Assets, x => x.Name == "Vendor.Dependency");
        var linux = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Embedded", "[1.0.0]")) with { Rid = "linux-x64" }, Platform("linux-x64"));
        Assert.NotEqual(result.LoadMap.LockSha512, linux.LoadMap.LockSha512);
    }

    [Theory]
    [InlineData("win-x64", "runtimes/win/lib/net8.0/Runtime.dll", "runtimes/win-x64/native/tool.dll")]
    [InlineData("linux-x64", "runtimes/unix/lib/net8.0/Runtime.dll", "runtimes/linux-x64/native/libtool.so")]
    public void Assets_SelectNearestRuntimeAndNative_WithoutReferenceAssemblies(string rid, string managed, string native) {
        var result = PackageAssets.Select(new[] { "ref/net10.0/Reference.dll", "lib/netstandard2.0/Base.dll", managed, native,
            "runtimes/any/lib/net10.0/Ignored.dll", "runtimes/any/native/ignored.dll" }, "net10.0", rid);
        Assert.Equal(new[] { managed }, result.Managed);
        Assert.Equal(new[] { native }, result.Native);
    }

    [Fact]
    public void Assets_RespectEmptyRuntimeGroup_AndRejectRefOnlyOrUnsupportedNative() {
        var empty = PackageAssets.Select(["lib/net10.0/Base.dll", "runtimes/win-x64/lib/net10.0/_._"], "net10.0", "win-x64");
        Assert.Empty(empty.Managed);
        Assert.Throws<ResolutionException>(() => PackageAssets.Select(["ref/net10.0/Only.dll"], "net10.0", "win-x64"));
        Assert.Throws<ResolutionException>(() => PackageAssets.Select(["runtimes/win-x64/native/a.dll"], "net10.0", "linux-x64"));
        Assert.Throws<InvalidDataException>(() => PackageAssets.Select([], "net10.0", "osx-arm64"));
        Assert.Throws<ResolutionException>(() => PackageAssets.Select(["runtimes/win-x64/lib/net10.0/Only.dll"], "net10.0", "linux-x64"));
    }

    [Fact]
    public async Task Plan_HonorsFloatingVersions_AndExcludesImplicitPrereleases() {
        var good = ChangeDependencies(File.ReadAllBytes(fixture.Good), ("Fixture.Dependency", "1.*"));
        var source = new MemorySource(good, Dependency(), Dependency("1.5.0"), Dependency("1.6.0-beta.1"), Dependency("2.0.0"));
        var result = await new PackagePlanner(source).PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform());
        Assert.Equal("1.5.0", result.Lock.Packages.Single(x => x.Id == "Fixture.Dependency").Version);
    }

    [Fact]
    public async Task Plan_RejectsNameCollision_InOnePrivateScope() {
        var bytes = File.ReadAllBytes(Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests/Fixtures/Dependency/bin/Release/net10.0/Vendor.Dependency.dll"));
        var source = new MemorySource(File.ReadAllBytes(fixture.Good), Dependency("1.0.0", ("Other.Package", "[1.0.0]")), Library("Other.Package", "1.0.0", bytes));
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(source).PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform()));
        Assert.Contains("name conflict", error.Message);
    }

    [Fact]
    public void Dependencies_UseNearestFramework_InsteadOfMergingGroups() {
        var xml = "<package><metadata><dependencies><group targetFramework=\"netstandard2.0\"><dependency id=\"Old\" version=\"[1.0.0]\" /></group>" +
            "<group targetFramework=\"net8.0\"><dependency id=\"Selected\" version=\"[2.0.0]\" /></group></dependencies></metadata></package>";
        var metadata = new PackageMetadata("Test", NuGetVersion.Parse("1.0.0"), System.Text.Encoding.UTF8.GetBytes(xml), null);
        Assert.Equal("selected", Assert.Single(PackageAssets.Dependencies(metadata, "net10.0")).Id);
    }

    [Fact]
    public async Task Plan_RejectsConflictingRootAndTransitivePluginVersions() {
        var graph = fixture.Build("Graph", "graph-conflicting-peer", "-p:PeerId=Fixture.Good");
        var source = new MemorySource(ChangeDependencies(File.ReadAllBytes(graph), ("Fixture.Good", "[9.0.0]")), File.ReadAllBytes(fixture.Good), Dependency());
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(source)
            .PlanAsync(Request(("Fixture.Graph", "[1.0.0]"), ("Fixture.Good", "[1.2.3-beta.1]")), Platform()));
        Assert.Contains("fixture.good", error.Message, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("Fixture.Graph", error.Message);
    }

    [Fact]
    public async Task Plan_MapsSelectedNativeAndRuntimeFiles_WithHashes() {
        var dll = File.ReadAllBytes(Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests/Fixtures/Dependency/bin/Release/net10.0/Vendor.Dependency.dll"));
        var bytes = AddFiles(Dependency(), ("runtimes/win-x64/lib/net10.0/Vendor.Dependency.dll", dll),
            ("runtimes/win-x64/native/helper.dll", new byte[] { 1, 2, 3 }), ("runtimes/linux-x64/native/libhelper.so", new byte[] { 4, 5, 6 }));
        var result = await new PackagePlanner(new MemorySource(File.ReadAllBytes(fixture.Good), bytes))
            .PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform());
        Assert.Contains(result.LoadMap.Assets, x => x.Name == "Vendor.Dependency" && x.Path!.StartsWith("runtimes/win-x64/"));
        var native = Assert.Single(result.LoadMap.Assets, x => x.Kind == "native");
        Assert.Equal("helper", native.Name);
        Assert.Equal("plugin:fixture.good", native.Owner);
        Assert.Equal(PlanJson.Hash([1, 2, 3]), native.Sha512);
        Assert.DoesNotContain(result.LoadMap.Assets, x => x.Path?.Contains("linux-x64") == true);
    }

    [Fact]
    public async Task Plan_RejectsRuntimePluginManifestSubstitution() {
        using var zip = ZipFile.OpenRead(fixture.Bad);
        using var input = zip.GetEntry("lib/net10.0/Bad.dll")!.Open();
        using var output = new MemoryStream();
        input.CopyTo(output);
        var package = AddFiles(File.ReadAllBytes(fixture.Good), ("runtimes/win-x64/lib/net10.0/Bad.dll", output.ToArray()));
        var archive = Path.Combine(fixture.Work, "runtime-variant.nupkg");
        File.WriteAllBytes(archive, package);
        Assert.Equal("Fixture.Good", PackageValidator.Validate(archive, PackageFixture.Inputs(fixture.Good)).PackageId);
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(new MemorySource(package, Dependency()))
            .PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform()));
        Assert.Contains("manifest differs", error.Message);
    }

    [Fact]
    public async Task Plan_RejectsPackageSpecificRuntimeGraph_InsteadOfIgnoringDependencies() {
        var dependency = AddFiles(Dependency(), ("runtime.json", System.Text.Encoding.UTF8.GetBytes("{\"runtimes\":{}}")));
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(new MemorySource(File.ReadAllBytes(fixture.Good), dependency))
            .PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), Platform()));
        Assert.Contains("runtime graphs", error.Message);
    }

    [Fact]
    public async Task Plan_RejectsReferenceAssembly_InPlatformCatalog() {
        var reference = File.ReadAllLines(Path.Combine(PackageFixture.Inputs(fixture.Good), "references.txt"))
            .Single(x => Path.GetFileName(x) == "System.Runtime.dll");
        var platform = Platform();
        platform = platform with { Assemblies = platform.Assemblies.Where(x => Path.GetFileName(x) != "System.Runtime.dll").Append(reference).ToArray() };
        var error = await Assert.ThrowsAsync<ResolutionException>(() => new PackagePlanner(new MemorySource(File.ReadAllBytes(fixture.Good), Dependency()))
            .PlanAsync(Request(("Fixture.Good", "[1.2.3-beta.1]")), platform));
        Assert.Contains("Reference assembly", error.Message);
    }

    [Fact]
    public async Task Cli_WritesBoundPlan_FromLocalRepository_AndPreservesExistingOutput() {
        var folder = Path.Combine(fixture.Work, "cli");
        Directory.CreateDirectory(folder);
        File.Copy(fixture.Embedded, Path.Combine(folder, "plugin.nupkg"));
        await using var app = RepositoryServer.Create(folder, "http://127.0.0.1:0");
        await app.StartAsync();
        try {
            var roots = Path.Combine(folder, "plugins.json");
            var platform = Path.Combine(folder, "platform.json");
            var sources = Path.Combine(folder, "sources.json");
            var output = Path.Combine(folder, "output");
            File.WriteAllBytes(roots, PlanJson.Bytes(Request(("Fixture.Embedded", "[1.0.0]"))));
            File.WriteAllBytes(platform, PlanJson.Bytes(Platform()));
            File.WriteAllBytes(sources, PlanJson.Bytes(new SourceConfiguration { PluginSources = [app.Urls.Single() + "/v3/index.json"] }));
            var args = new[] { typeof(PackagePlanner).Assembly.Location, "plan", roots, platform, sources, output };
            var run = await Task.Run(() => PackageFixture.Run("dotnet", args));
            Assert.True(run.Code == 0, run.Output);
            var locked = File.ReadAllBytes(Path.Combine(output, "plugins.lock.json"));
            Assert.Equal(PlanJson.Hash(locked), PlanJson.Read<LoadMap>(Path.Combine(output, "load-map.json")).LockSha512);
            Assert.NotEqual(0, (await Task.Run(() => PackageFixture.Run("dotnet", args))).Code);
            Assert.Equal(locked, File.ReadAllBytes(Path.Combine(output, "plugins.lock.json")));
            Assert.Empty(Directory.GetDirectories(folder, ".plan-*"));
            Assert.False(File.Exists(Path.Combine(folder, "appsettings.plugins.json")));
            File.WriteAllBytes(platform, PlanJson.Bytes(Platform() with { Version = "3.0.0" }));
            var failedOutput = Path.Combine(folder, "failed");
            args[^1] = failedOutput;
            Assert.NotEqual(0, (await Task.Run(() => PackageFixture.Run("dotnet", args))).Code);
            Assert.False(Directory.Exists(failedOutput));
            Assert.Empty(Directory.GetDirectories(folder, ".plan-*"));
        } finally { await app.StopAsync(); }
    }

    private sealed class MemorySource(params byte[][] packages) : IPackageSource {
        private readonly Dictionary<string, byte[]> data = packages.ToDictionary(x => {
            var metadata = PackageMetadata.Read(x, false);
            return metadata.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(metadata.Version);
        });
        private readonly Uri source = new("https://fixtures.invalid/v3/index.json");
        public Task<PackageListing> FindAsync(PackageKind kind, string id, CancellationToken cancellation = default) {
            var versions = data.Keys.Where(x => x.StartsWith(id.ToLowerInvariant() + "/", StringComparison.Ordinal))
                .Select(x => NuGetVersion.Parse(x.Split('/')[1])).ToArray();
            if (versions.Length == 0) throw new KeyNotFoundException(id);
            return Task.FromResult(new PackageListing(source, source, versions));
        }
        public Task<PackageDownload> DownloadAsync(PackageKind kind, string id, NuGetVersion version, CancellationToken cancellation = default) {
            var bytes = data[id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(version)];
            return Task.FromResult(new PackageDownload(source, PackageMetadata.Read(bytes, kind == PackageKind.Plugin), bytes, PlanJson.Hash(bytes)));
        }
    }
}
