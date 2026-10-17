using System.IO.Compression;
using System.Text.Json;
using System.Xml.Linq;
using NuGet.Versioning;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;
using ThinkingHome.Repository;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class ManagementTests(PackageFixture fixture) : IClassFixture<PackageFixture>
{
    private string App() => Path.Combine(fixture.Work, "apps", Guid.NewGuid().ToString("N"));

    private TestSource Source() => new(File.ReadAllBytes(fixture.Good), File.ReadAllBytes(fixture.Embedded),
        File.ReadAllBytes(fixture.Library));

    private PackageManager Manager(string app, TestSource? source = null) => new(app, fixture.Platform(), source);

    private static string Store(string app, string key) => Path.Combine(app, ".thinkinghome", "packages", key.Replace('/',
        Path.DirectorySeparatorChar));

    private static string Pointer(string app) => Path.Combine(app, ".thinkinghome", "current.json");

    [Fact]
    public async Task Remove_PrunesUnusedGraph_WithoutChangingRemainingPackagesOrRunningSnapshot()
    {
        var app = App();
        var source = Source();
        source.Add(File.ReadAllBytes(fixture.Shared));
        var manager = Manager(app, source);
        await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        await manager.InstallAsync("Fixture.Bad", "[1.0.0]");
        var before = await manager.InstallAsync("Fixture.Embedded", "[1.0.0]");

        var settings = Path.Combine(app, "appsettings.json");
        File.WriteAllText(settings, "user settings");
        using var running = manager.OpenSnapshot();
        var removed = await Manager(app).RemoveAsync("FIXTURE.BAD");

        Assert.Equal(before.Generation, running.State.Generation);
        Assert.DoesNotContain(removed.Plan.Lock.Packages, x => x.Id == "Fixture.Bad");
        Assert.DoesNotContain(removed.Plan.LoadMap.Assets, x => x.Owner == "shared");
        Assert.Contains(removed.Plan.LoadMap.Assets, x => x.Name == "Vendor.Dependency" && x.Owner == "plugin:fixture.good");
        Assert.Equal("user settings", File.ReadAllText(settings));

        foreach (var package in removed.Plan.Lock.Packages)
            Assert.Equal(PlanJson.Bytes(before.Plan.Lock.Packages.Single(x => x.Key == package.Key)), PlanJson.Bytes(package));
        Assert.Equal(removed.Generation, Manager(app).Validate().Generation);
        manager.Validate(running);

        var last = await Manager(app).RemoveAsync("Fixture.Good");
        Assert.Single(last.Plan.Lock.Packages);
        Assert.Equal("Fixture.Embedded", last.Plan.Lock.Packages[0].Id);
        Assert.True(Directory.Exists(Store(app, "fixture.good/1.2.3-beta.1")));

        var empty = await Manager(app).RemoveAsync("Fixture.Embedded");
        Assert.Empty(empty.Request.Plugins);
        Assert.Empty(empty.Plan.Lock.Packages);
        Assert.Empty(empty.Plan.Lock.Nodes);
        Assert.Empty(empty.Plan.Lock.PluginOrder);
        Assert.Equal(empty.Generation, Manager(app).Validate().Generation);
        var restored = await Manager(App()).RestoreLockedAsync(empty.Request, empty.Plan);
        Assert.Empty(restored.Plan.Lock.Packages);
    }

    [Theory]
    [InlineData(false, false)]
    [InlineData(false, true)]
    [InlineData(true, false)]
    [InlineData(true, true)]
    public async Task Remove_RejectsRequiredPlugin_IncludingTransitiveAndExplicitRoots(bool throughLibrary, bool explicitRoot)
    {
        var app = App();
        var source = Source();
        var bytes = File.ReadAllBytes(throughLibrary ? fixture.Library : fixture.Good);
        source.Add(WithDependency(bytes, "Fixture.Embedded", "[1.0.0]"));
        var manager = Manager(app, source);
        if (explicitRoot) await manager.InstallAsync("Fixture.Embedded", "[1.0.0]");
        await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");

        var pointer = File.ReadAllBytes(Pointer(app));
        var error = await Assert.ThrowsAsync<InvalidOperationException>(() => Manager(app).RemoveAsync("Fixture.Embedded"));
        Assert.Contains("required by", error.Message);
        Assert.Contains("plugin:fixture.good", error.Message);
        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
        manager.Validate();

        // Удаление потребителя убирает зависимый плагин только при отсутствии отдельного корня.
        var result = await Manager(app).RemoveAsync("Fixture.Good");
        Assert.Equal(explicitRoot ? 1 : 0, result.Plan.Lock.Packages.Length);
        Manager(app).Validate();
    }

    [Theory]
    [InlineData("Missing.Plugin")]
    [InlineData("Fixture.Dependency")]
    public async Task Remove_RejectsMissingPluginAndLibrary_WithoutChangingState(string id)
    {
        var app = App();
        await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var pointer = File.ReadAllBytes(Pointer(app));
        var error = await Assert.ThrowsAsync<InvalidOperationException>(() => Manager(app).RemoveAsync(id));
        Assert.Contains("not installed", error.Message);
        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
    }

    [Theory]
    [InlineData("staged", false)]
    [InlineData("state-published", false)]
    [InlineData("state-published", true)]
    public async Task Remove_FailureOrCancellation_PreservesActiveState(string checkpoint, bool cancel)
    {
        var app = App();
        await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var pointer = File.ReadAllBytes(Pointer(app));
        using var cancellation = new CancellationTokenSource();
        var manager = new PackageManager(app, fixture.Platform())
        {
            Checkpoint = value =>
            {
                if (value != checkpoint) return;
                if (cancel) cancellation.Cancel();
                else throw new IOException("injected failure");
            }
        };

        if (cancel)
            await Assert.ThrowsAnyAsync<OperationCanceledException>(() => manager.RemoveAsync("Fixture.Good", cancellation.Token));
        else
            await Assert.ThrowsAsync<IOException>(() => manager.RemoveAsync("Fixture.Good"));

        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
        Manager(app).Validate();
        Assert.False(File.Exists(Path.Combine(app, ".thinkinghome/transaction.json")));
    }

    private static byte[] WithDependency(byte[] bytes, string id, string version)
    {
        using var buffer = new MemoryStream();
        buffer.Write(bytes);
        using (var zip = new ZipArchive(buffer, ZipArchiveMode.Update, true))
        {
            var entry = zip.Entries.Single(x => x.FullName.EndsWith(".nuspec"));
            XDocument xml;
            using (var input = entry.Open()) xml = XDocument.Load(input);
            var group = xml.Descendants().Single(x => x.Name.LocalName == "group");
            group.Add(new XElement(group.Name.Namespace + "dependency", new XAttribute("id", id), new XAttribute("version", version)));

            var name = entry.FullName;
            entry.Delete();
            using var output = zip.CreateEntry(name).Open();
            xml.Save(output);
        }

        return buffer.ToArray();
    }

    [Fact]
    public async Task Remove_RejectsCorruptState_AndConcurrentOperation()
    {
        var app = App();
        await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var pointer = File.ReadAllBytes(Pointer(app));
        using (var busy = new FileStream(Path.Combine(app, ".thinkinghome/operation.lock"), FileMode.Open,
            FileAccess.ReadWrite, FileShare.None))
        {
            var error = await Assert.ThrowsAsync<IOException>(() => Manager(app).RemoveAsync("Fixture.Good"));
            Assert.Contains("Another package operation", error.Message);
        }

        File.WriteAllText(Path.Combine(Store(app, "fixture.good/1.2.3-beta.1"), "files/unexpected.txt"), "corrupt");
        await Assert.ThrowsAsync<InvalidDataException>(() => Manager(app).RemoveAsync("Fixture.Good"));
        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
    }

    [Fact]
    public async Task Install_WritesCompleteSnapshot_AndValidatesOffline()
    {
        var app = App();
        var source = Source();
        var manager = Manager(app, source);
        var state = await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        Assert.Equal(2, state.Plan.Lock.Packages.Length);
        Assert.Single(state.Request.Plugins);

        Assert.Equal(state.Generation, Manager(app).Validate().Generation);
        Assert.Equal(2, source.Downloads);
        Assert.False(File.Exists(Path.Combine(app, "appsettings.json")));
        Assert.False(File.Exists(Path.Combine(app, "appsettings.plugins.json")));
        using var snapshot = manager.OpenSnapshot();
        Assert.True(File.Exists(Path.Combine(snapshot.PackageDirectory("fixture.good/1.2.3-beta.1"), "lib/net10.0/Good.dll")));
    }

    [Fact]
    public async Task Ci_ReproducesFreshInstallation_WithoutVersionSelection()
    {
        var source = Source();
        var original = await Manager(App(), source).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        source.ForbidListing = true;
        var app = App();
        var copy = await Manager(app, source).RestoreLockedAsync(original.Request, original.Plan);
        Assert.Equal(PlanJson.Bytes(original.Plan), PlanJson.Bytes(copy.Plan));

        Assert.Equal(2, source.LockedDownloads);
        Assert.Equal(copy.Generation, Manager(app).Validate().Generation);
        var second = await Manager(app).RestoreLockedAsync(copy.Request, copy.Plan);
        Assert.Equal(PlanJson.Bytes(copy.Plan), PlanJson.Bytes(second.Plan));
    }

    [Fact]
    public async Task Install_ChangesVersion_AndRetainsRunningSnapshotAndOldFiles()
    {
        var source = Source();
        var nextPackage = fixture.Build("Good", "next-version", "-p:FixtureVersion=1.2.4");
        source.Add(File.ReadAllBytes(nextPackage));
        var app = App();
        var manager = Manager(app, source);
        var first = await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");

        using var running = manager.OpenSnapshot();
        var second = await manager.InstallAsync("Fixture.Good", "[1.2.4]");
        Assert.Equal(first.Generation, running.State.Generation);
        Assert.NotEqual(first.Generation, second.Generation);
        Assert.True(Directory.Exists(Store(app, "fixture.good/1.2.3-beta.1")));
        Assert.True(Directory.Exists(Store(app, "fixture.good/1.2.4")));

        Assert.Single(Directory.GetDirectories(Path.Combine(app, ".thinkinghome/packages/fixture.dependency")));
        Assert.Single(second.Request.Plugins);
        Assert.Equal(VersionRange.Parse("[1.2.4]"), VersionRange.Parse(second.Request.Plugins[0].Version));
        Assert.Equal(second.Generation, Manager(app).Validate().Generation);
    }

    [Theory]
    [InlineData("staged")]
    [InlineData("package-published")]
    [InlineData("state-published")]
    public async Task Install_FailureBeforeCommit_PreservesActiveState(string checkpoint)
    {
        var app = App();
        var source = Source();
        await Manager(app, source).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var original = File.ReadAllBytes(Pointer(app));

        var failing = new PackageManager(app, fixture.Platform(), source)
        {
            Checkpoint = value =>
            {
                if (value == checkpoint)
                {
                    throw new IOException("injected failure");
                }
            }
        };

        await Assert.ThrowsAsync<IOException>(() => failing.InstallAsync("Fixture.Embedded", "[1.0.0]"));
        Assert.Equal(original, File.ReadAllBytes(Pointer(app)));
        Manager(app).Validate();
        Assert.False(File.Exists(Path.Combine(app, ".thinkinghome/transaction.json")));
        Assert.Empty(Directory.GetDirectories(Path.Combine(app, ".thinkinghome/staging")));
    }

    [Fact]
    public async Task Install_CancellationAfterPublishingPackages_PreservesState()
    {
        var app = App();
        var source = Source();
        await Manager(app, source).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var original = File.ReadAllBytes(Pointer(app));
        using var cancellation = new CancellationTokenSource();

        var manager = new PackageManager(app, fixture.Platform(), source)
        {
            Checkpoint = value =>
            {
                if (value == "package-published")
                {
                    cancellation.Cancel();
                }
            }
        };

        await Assert.ThrowsAnyAsync<OperationCanceledException>(() => manager.InstallAsync("Fixture.Embedded", "[1.0.0]",
            cancellation.Token));
        Assert.Equal(original, File.ReadAllBytes(Pointer(app)));
        Manager(app).Validate();
    }

    [Fact]
    public async Task Ci_RepairsMissingAndModifiedFiles_FromLocalArchive_WhenNotInUse()
    {
        var app = App();
        var state = await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var file = Path.Combine(Store(app, "fixture.good/1.2.3-beta.1"), "files/lib/net10.0/Good.dll");
        var original = File.ReadAllBytes(file);
        File.WriteAllText(file, "corrupt");
        Assert.Throws<InvalidDataException>(() => Manager(app).Validate());

        await Manager(app).RestoreLockedAsync(state.Request, state.Plan);
        Assert.Equal(original, File.ReadAllBytes(file));
        File.Delete(file);
        await Manager(app).RestoreLockedAsync(state.Request, state.Plan);
        Manager(app).Validate();
    }

    [Fact]
    public async Task Ci_DoesNotRepairFilesHeldByRunningSnapshot()
    {
        var app = App();
        var manager = Manager(app, Source());
        var state = await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        using var running = manager.OpenSnapshot();
        var file = Path.Combine(running.PackageDirectory("fixture.good/1.2.3-beta.1"), "content/asset.txt");
        File.WriteAllText(file, "corrupt");

        var pointer = File.ReadAllBytes(Pointer(app));
        var error = await Assert.ThrowsAsync<IOException>(() => manager.RestoreLockedAsync(state.Request, state.Plan));
        Assert.Contains("in use", error.Message);
        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
        Assert.Equal("corrupt", File.ReadAllText(file));
    }

    [Fact]
    public async Task Ci_RollsBackRepair_WhenCommitFails()
    {
        var app = App();
        var state = await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var file = Path.Combine(Store(app, "fixture.good/1.2.3-beta.1"), "files/content/asset.txt");
        File.WriteAllText(file, "old damaged content");

        var manager = new PackageManager(app, fixture.Platform())
        {
            Checkpoint = value =>
            {
                if (value == "state-published")
                {
                    throw new IOException("injected failure");
                }
            }
        };

        var pointer = File.ReadAllBytes(Pointer(app));
        await Assert.ThrowsAsync<IOException>(() => manager.RestoreLockedAsync(state.Request, state.Plan));
        Assert.Equal(pointer, File.ReadAllBytes(Pointer(app)));
        Assert.Equal("old damaged content", File.ReadAllText(file));
    }

    [Fact]
    public async Task Operations_AreSerialized()
    {
        var app = App();
        Directory.CreateDirectory(Path.Combine(app, ".thinkinghome"));
        using var busy = new FileStream(Path.Combine(app, ".thinkinghome/operation.lock"), FileMode.Create,
            FileAccess.ReadWrite, FileShare.None);
        var error = await Assert.ThrowsAsync<IOException>(() => Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]"));
        Assert.Contains("Another package operation", error.Message);
        Assert.False(File.Exists(Pointer(app)));
    }

    [Fact]
    public async Task Ci_RejectsDeclarationTargetMapAndPlatformDrift()
    {
        var original = await Manager(App(), Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var app = App();
        var manager = Manager(app, Source());
        await Assert.ThrowsAsync<InvalidDataException>(() =>
            manager.RestoreLockedAsync(original.Request with { Plugins = [new("Fixture.Good", "[9.0.0]")] }, original.Plan));
        await Assert.ThrowsAsync<InvalidDataException>(() =>
            manager.RestoreLockedAsync(original.Request with { Rid = "linux-x64" }, original.Plan));

        var tampered = original.Plan with
        {
            LoadMap = original.Plan.LoadMap with
            {
                Assets = []
            }
        };

        await Assert.ThrowsAsync<InvalidDataException>(() => manager.RestoreLockedAsync(original.Request, tampered));
        var platform = fixture.Platform() with
        {
            Version = "4.0.0-alpha35"
        };
        await Assert.ThrowsAsync<InvalidDataException>(() => new PackageManager(app, platform,
            Source()).RestoreLockedAsync(original.Request, original.Plan));

        Assert.False(File.Exists(Pointer(app)));
    }

    [Fact]
    public async Task Ci_RejectsChangedArchiveAndPinnedSource_WithoutInstalling()
    {
        var source = Source();
        var original = await Manager(App(), source).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        source.ChangeBytes = true;
        var app = App();
        await Assert.ThrowsAsync<InvalidDataException>(() => Manager(app, source).RestoreLockedAsync(original.Request, original.Plan));
        Assert.False(File.Exists(Pointer(app)));

        source.ChangeBytes = false;
        source.ChangeSource = true;
        await Assert.ThrowsAsync<InvalidDataException>(() => Manager(app, source).RestoreLockedAsync(original.Request, original.Plan));
        Assert.False(File.Exists(Pointer(app)));
    }

    [Theory]
    [InlineData("extra-file")]
    [InlineData("archive")]
    [InlineData("document")]
    [InlineData("generated-configuration")]
    public async Task Validate_RejectsTamperedInstalledState(string kind)
    {
        var app = App();
        var state = await Manager(app, Source()).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");

        if (kind == "extra-file")
        {
            File.WriteAllText(Path.Combine(Store(app, "fixture.good/1.2.3-beta.1"), "files/unexpected.dll"), "unexpected");
        }
        else if (kind == "archive")
        {
            File.WriteAllText(Path.Combine(Store(app, "fixture.good/1.2.3-beta.1"), "package.nupkg"), "changed");
        }
        else if (kind == "generated-configuration")
        {
            File.AppendAllText(Path.Combine(state.Directory, "appsettings.plugins.json"), " ");
        }
        else
        {
            File.AppendAllText(Path.Combine(state.Directory, "plugins.json"), " ");
        }

        Assert.Throws<InvalidDataException>(() => Manager(app).Validate());
    }

    [Fact]
    public async Task Recover_RollsBackInterruptedRepair_BeforeAllowingSnapshot()
    {
        var app = App();
        var manager = Manager(app, Source());
        var state = await manager.InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        var generation = Guid.NewGuid().ToString("N");
        var key = "fixture.good/1.2.3-beta.1";
        var backup = Path.Combine(app, ".thinkinghome/staging", generation, "backups", key);

        Directory.CreateDirectory(Path.GetDirectoryName(backup)!);
        File.WriteAllBytes(Path.Combine(app, ".thinkinghome/transaction.json"), PlanJson.Bytes(new TransactionJournal(1,
            generation, state.Generation, [key])));
        Directory.Move(Store(app, key), backup);
        Assert.Throws<IOException>(() => manager.OpenSnapshot());
        manager.Recover();
        Assert.Equal(state.Generation, manager.Validate().Generation);

        Assert.False(Directory.Exists(Path.Combine(app, ".thinkinghome/staging", generation)));
    }

    [Fact]
    public async Task Recover_KeepsCommittedState_AndRemovesBackup()
    {
        var app = App();
        var manager = Manager(app, Source());
        var state = await manager.InstallAsync("Fixture.Embedded", "[1.0.0]");
        var backup = Path.Combine(app, ".thinkinghome/staging", state.Generation, "backups/fixture.embedded/1.0.0");
        Directory.CreateDirectory(backup);
        File.WriteAllText(Path.Combine(backup, "old.txt"), "old damaged content");

        File.WriteAllBytes(Path.Combine(app, ".thinkinghome/transaction.json"), PlanJson.Bytes(new TransactionJournal(1,
            state.Generation, null, ["fixture.embedded/1.0.0"])));
        manager.Recover();
        Assert.Equal(state.Generation, manager.Validate().Generation);
        Assert.False(Directory.Exists(backup));
    }

    [Fact]
    public async Task Install_RejectsRepublishedIdentity_EvenWhenStoreDirectoryIsMissing()
    {
        var app = App();
        var source = Source();
        var state = await Manager(app, source).InstallAsync("Fixture.Good", "[1.2.3-beta.1]");
        source.Add(File.ReadAllBytes(fixture.Mutate(zip => zip.CreateEntry("new-content.txt"))));
        Directory.Move(Store(app, "fixture.good/1.2.3-beta.1"), Path.Combine(app, "saved-package"));
        var error = await Assert.ThrowsAsync<InvalidDataException>(() => Manager(app, source).InstallAsync("Fixture.Good",
            "[1.2.3-beta.1]"));

        Assert.Contains("Immutable package identity", error.Message);
        using var snapshot = Manager(app).OpenSnapshot();
        Assert.Equal(state.Generation, snapshot.State.Generation);
    }

    [Fact]
    public async Task Cli_UsesBundledPlatform_AndHostAcceptsInstalledAndRestoredPackages()
    {
        var folder = Path.Combine(fixture.Work, "cli-repository");
        Directory.CreateDirectory(folder);
        File.Copy(fixture.Embedded, Path.Combine(folder, "embedded.nupkg"));
        await using var server = RepositoryServer.Create(folder, "http://127.0.0.1:0");
        await server.StartAsync();

        try
        {
            // Проверяем реальную поставку двух программ, а не платформу процесса тестов.
            var bundle = Path.Combine(fixture.Work, "cli-bundle");
            var publish = PackageFixture.Run("dotnet", "publish",
                Path.Combine(fixture.Root, "ThinkingHome.Console/ThinkingHome.Console.csproj"),
                "-c", "Release", "-o", bundle, "-m:1", "-p:UseSharedCompilation=false", "-p:NuGetAudit=false");
            Assert.True(publish.Code == 0, publish.Output);
            Assert.False(File.Exists(Path.Combine(bundle, "appsettings.Development.json")));
            Assert.False(File.Exists(Path.Combine(bundle, "plugins.local.json")));
            var tool = Path.Combine(bundle, "ThinkingHome.PackageManagement.dll");
            var host = Path.Combine(bundle, "ThinkingHome.Console.dll");

            var sources = Path.Combine(folder, "sources.json");
            File.WriteAllBytes(sources,
                PlanJson.Bytes(new SourceConfiguration { PluginSources = [server.Urls.Single() + "/v3/index.json"] }));
            var app = App();
            var install = await Task.Run(() => PackageFixture.Run("dotnet", tool, "install", app,
                "Fixture.Embedded", "[1.0.0]", sources));
            Assert.True(install.Code == 0, install.Output);

            var check = PackageFixture.Run("dotnet", host, "--app", app, "--check");
            Assert.True(check.Code == 0, check.Output);
            var state = Directory.GetDirectories(Path.Combine(app, ".thinkinghome/states")).Single();
            var copy = App();
            var restore = await Task.Run(() => PackageFixture.Run("dotnet", tool, "ci", copy,
                Path.Combine(state, "plugins.json"), state, sources));
            Assert.True(restore.Code == 0, restore.Output);

            var validation = PackageFixture.Run("dotnet", tool, "validate", copy);
            Assert.True(validation.Code == 0, validation.Output);
            var restoredCheck = PackageFixture.Run("dotnet", host, "--app", copy, "--check");
            Assert.True(restoredCheck.Code == 0, restoredCheck.Output);
            var recovery = PackageFixture.Run("dotnet", tool, "recover", copy);
            Assert.True(recovery.Code == 0, recovery.Output);

            var remove = PackageFixture.Run("dotnet", tool, "remove", copy, "Fixture.Embedded");
            Assert.True(remove.Code == 0, remove.Output);
            var emptyCheck = PackageFixture.Run("dotnet", host, "--app", copy, "--check");
            Assert.True(emptyCheck.Code == 0, emptyCheck.Output);
            Assert.Equal(0, PackageFixture.Run("dotnet", tool, "validate", copy).Code);
            Assert.Equal(1, PackageFixture.Run("dotnet", tool, "remove", copy, "Fixture.Embedded").Code);
            Assert.Equal(2, PackageFixture.Run("dotnet", tool, "remove", copy).Code);

            // Файл платформы больше не является ни входом, ни результатом команд.
            Assert.Empty(Directory.GetFiles(app, "platform.json", SearchOption.AllDirectories));
            Assert.Empty(Directory.GetFiles(copy, "platform.json", SearchOption.AllDirectories));
            var obsolete = PackageFixture.Run("dotnet", tool, "validate", copy, "platform.json");
            Assert.Equal(2, obsolete.Code);
        }
        finally
        {
            await server.StopAsync();
        }
    }

    private sealed class TestSource(params byte[][] packages) : ILockedPackageSource
    {
        private readonly Dictionary<string, byte[]> data = new(StringComparer.Ordinal);
        private bool initialized;

        internal int Downloads { get; private set; }

        internal int LockedDownloads { get; private set; }

        internal bool ForbidListing { get; set; }

        internal bool ChangeBytes { get; set; }

        internal bool ChangeSource { get; set; }

        private readonly Uri uri = new("https://fixtures.invalid/v3/index.json");

        internal void Add(byte[] bytes)
        {
            Ensure();
            var metadata = PackageMetadata.Read(bytes, false);
            data[metadata.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(metadata.Version)] = bytes;
        }

        private void Ensure()
        {
            if (initialized)
            {
                return;
            }

            initialized = true;

            foreach (var bytes in packages)
            {
                Add(bytes);
            }
        }

        public Task<PackageListing> FindAsync(PackageKind kind, string id, CancellationToken cancellation = default)
        {
            Ensure();

            if (ForbidListing)
            {
                throw new InvalidOperationException("Version selection must not run during locked restore");
            }

            return Task.FromResult(new PackageListing(uri, uri, data.Keys.Where(x =>
                x.StartsWith(id.ToLowerInvariant() + "/") && PackageFixture.IsPlugin(data[x]) == (kind == PackageKind.Plugin))
                .Select(x => NuGetVersion.Parse(x.Split('/')[1])).ToArray()));
        }

        public Task<PackageDownload> DownloadAsync(PackageKind kind, string id, NuGetVersion version,
            CancellationToken cancellation = default)
        {
            Downloads++;

            return Download(kind, id, version);
        }

        public Task<PackageDownload> DownloadLockedAsync(Uri source, PackageKind kind, string id, NuGetVersion version,
            CancellationToken cancellation = default)
        {
            Assert.Equal(uri, source);
            LockedDownloads++;

            return Download(kind, id, version);
        }

        private Task<PackageDownload> Download(PackageKind kind, string id, NuGetVersion version)
        {
            Ensure();
            var bytes = data[id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(version)];
            var metadata = PackageMetadata.Read(bytes, kind == PackageKind.Plugin);

            if (ChangeBytes)
            {
                bytes = bytes.Concat(new byte[] { 1 }).ToArray();
            }

            return Task.FromResult(new PackageDownload(ChangeSource ? new Uri("https://other.invalid/v3/index.json") : uri,
                metadata, bytes, PlanJson.Hash(bytes)));
        }
    }
}
