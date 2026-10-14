using System.Globalization;
using System.Reflection;
using System.Resources;
using System.Runtime.Loader;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NuGet.Versioning;
using ThinkingHome.Core.Infrastructure;
using ThinkingHome.Core.Plugins;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageRuntime;
using ThinkingHome.Platform;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;
using ThinkingHome.Repository;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class RuntimeTests(PackageFixture fixture) : IClassFixture<PackageFixture>, IDisposable
{
    public void Dispose()
    {
        GC.Collect();
        GC.WaitForPendingFinalizers();
        GC.Collect();
    }

    private string Folder()
    {
        var path = Path.Combine(fixture.Work, "runtime-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(path);

        return path;
    }

    private string PackTimer(string output)
    {
        var result = PackageFixture.Run("dotnet", typeof(PackageValidator).Assembly.Location, "pack",
            Path.Combine(fixture.Root, "ThinkingHome.Plugins.Timer/ThinkingHome.Plugins.Timer.csproj"), output);
        Assert.True(result.Code == 0, result.Output);

        return Directory.GetFiles(output, "*.nupkg").Single();
    }

    [Fact]
    public async Task EntryPoints_AreDiscoveredIdentically_ForPackagesAndLocalAssemblies()
    {
        var timer = PackTimer(Folder());
        var package = fixture.Build("Runtime", "runtime-entry-shapes", "-p:HandlerCase=ENTRY_SHAPES");
        var expected = new[] { "Fixture.ClosedPlugin", "Fixture.Container+NestedPlugin", "Fixture.IndirectPlugin", "Fixture.RuntimePlugin" };
        var validated = PackageValidator.Validate(package, PackageFixture.Inputs(package));
        Assert.Equal(expected, validated.EntryPoints);

        var platform = HostPlatform.Current();
        var installedFolder = Folder();
        await Install(installedFolder, platform, [timer, package], [new("Fixture.Runtime", "[1.0.0]")]);
        using var installed = PluginRuntime.Open(installedFolder, platform);
        Assert.Equal(expected, installed.PluginTypes.Where(x => x.Assembly.GetName().Name == "Runtime")
            .Select(x => x.FullName).Order(StringComparer.Ordinal));

        var localFolder = Folder();
        await Install(localFolder, platform, [timer], [new("ThinkingHome.Plugins.Timer", "[4.0.0-alpha34]")]);
        var dll = BuildLocal("Runtime", "-p:HandlerCase=ENTRY_SHAPES");
        Connect(localFolder, [dll], [new("Fixture.Runtime", "[1.0.0]")]);
        using var local = PluginRuntime.Open(localFolder, platform);
        Assert.Equal(expected, local.PluginTypes.Where(x => x.Assembly.GetName().Name == "Runtime")
            .Select(x => x.FullName).Order(StringComparer.Ordinal));
    }

    [Fact]
    public void Local_RejectsIncompatibleCoreDependency_FromBuildMetadata()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime");
        var depsPath = Path.ChangeExtension(dll, ".deps.json");
        var deps = System.Text.Json.Nodes.JsonNode.Parse(File.ReadAllText(depsPath))!;
        var target = deps["runtimeTarget"]!["name"]!.GetValue<string>();
        deps["targets"]![target]!["Runtime/1.0.0"]!["dependencies"]!["ThinkingHome.Core.Plugins"] = "99.0.0";
        File.WriteAllText(depsPath, deps.ToJsonString());

        var timer = Path.Combine(Path.GetDirectoryName(dll)!, "ThinkingHome.Plugins.Timer.dll");
        Connect(folder, [dll, timer], [new("Fixture.Runtime", "[1.0.0]")]);
        var error = Assert.Throws<ResolutionException>(() => PluginRuntime.Open(folder, HostPlatform.Current()));
        Assert.Contains("thinkinghome.core.plugins", error.Message);
        Assert.Contains("99.0.0", error.Message);
    }

    [Fact]
    public void Platform_ExcludesImplementationDependenciesOfHostAndManager()
    {
        var platform = HostPlatform.Current();
        var names = platform.Assemblies.Select(path => AssemblyName.GetAssemblyName(path).Name).ToArray();

        Assert.Contains("ThinkingHome.Core.Plugins", names);
        Assert.Contains("Microsoft.AspNetCore.Http", names);
        Assert.DoesNotContain("System.CommandLine", names);
        Assert.DoesNotContain("NuGet.Protocol", names);
        Assert.DoesNotContain("ThinkingHome.PackageManagement", names);
        Assert.DoesNotContain("ThinkingHome.PackageRuntime", names);
    }

    [Fact]
    public async Task InstalledPlugins_StartWithTypedDI_AndStopInReverseOrder_WithoutDefaultPluginAssemblies()
    {
        var folder = Folder();
        var timer = PackTimer(Folder());
        var local = fixture.Build("Runtime", "runtime-good");
        var platform = HostPlatform.Current();
        await Install(folder, platform, [timer, local], [new("Fixture.Runtime", "[1.0.0]")]);
        // Проверяем типизированную зависимость между двумя контекстами плагинов.
        using var runtime = PluginRuntime.Open(folder, platform);
        var plugin = runtime.PluginTypes.Single(x => x.Name == "RuntimePlugin");
        var timerType = runtime.PluginTypes.Single(x => x.Name == "TimerPlugin");
        Assert.Same(timerType, plugin.GetConstructors().Single().GetParameters().Single().ParameterType);

        // Пользовательская конфигурация применяется при реальном запуске жизненного цикла.
        File.WriteAllText(Path.Combine(folder, "appsettings.json"),
            "{\"plugins\":{\"Fixture.RuntimePlugin\":{\"value\":\"user\"}},\"assemblies\":[\"Missing.Legacy.Assembly\"]}");
        var app = new HomeApplication();

        try
        {
            app.StartServices(new HomeConfiguration(folder,
                PackageManager.GeneratedConfiguration(runtime.Plan.Lock)), runtime.PluginTypes);
        }
        finally
        {
            app.StopServices();
        }

        Assert.Equal("init:user;start;stop;", plugin.GetProperty("Lifecycle")!.GetValue(null));
        Assert.DoesNotContain(AssemblyLoadContext.Default.Assemblies, x => x.GetName().Name is "Runtime" or "ThinkingHome.Plugins.Timer");
        Assert.True(File.Exists(Path.Combine(runtime.State!.Directory, "appsettings.plugins.json")));
        var config = File.ReadAllBytes(Path.Combine(runtime.State!.Directory, "appsettings.plugins.json"));
        Assert.Equal(PackageManager.GeneratedConfiguration(runtime.Plan.Lock), config);
        var file = Path.Combine(folder, ".thinkinghome/packages/fixture.runtime/1.0.0/files/lib/net10.0/Runtime.dll");

        Assert.ThrowsAny<Exception>(() =>
            AssemblyLoadContext.GetLoadContext(plugin.Assembly)!.LoadFromAssemblyName(new AssemblyName("Undeclared.Plugin.Library")));
        Assert.True(File.Exists(file));
    }

    [Fact]
    public async Task LocalBuild_UsesInstalledPlugin_AndLeavesStateUntouched_WithPortableSymbols()
    {
        var folder = Folder();
        var timer = PackTimer(Folder());
        var platform = HostPlatform.Current();
        await Install(folder, platform, [timer], [new("ThinkingHome.Plugins.Timer", "[4.0.0-alpha34]")]);
        var pointer = File.ReadAllBytes(Path.Combine(folder, ".thinkinghome/current.json"));
        var dll = BuildLocal("Runtime");

        Connect(folder, [dll], [new("Fixture.Runtime", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, platform);
        var type = runtime.PluginTypes.Single(x => x.Name == "RuntimePlugin");
        Assert.Equal(dll, type.Assembly.Location, ignoreCase: true);
        Assert.True(File.Exists(Path.ChangeExtension(dll, ".pdb")));
        Assert.Equal(pointer, File.ReadAllBytes(Path.Combine(folder, ".thinkinghome/current.json")));

        Assert.Equal(2, runtime.PluginTypes.Count);
        Assert.DoesNotContain(runtime.Plan.Lock.Packages, x => x.Source.Contains("development"));
    }

    [Fact]
    public async Task Runtime_RejectsIncompatibleHandler_WhenTimerRegistersIt()
    {
        var folder = Folder();
        var timer = PackTimer(Folder());
        var invalid = fixture.Build("Runtime", "runtime-bad", "-p:HandlerCase=BAD_HANDLER");
        await Install(folder, HostPlatform.Current(), [timer, invalid], [new("Fixture.Runtime", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, HostPlatform.Current());
        var app = new HomeApplication();

        try
        {
            var error = Assert.Throws<InvalidOperationException>(() =>
                app.StartServices(new HomeConfiguration(folder), runtime.PluginTypes));
            Assert.Contains("RuntimePlugin.Callback", error.Message);
        }
        finally
        {
            app.StopServices();
        }
    }

    [Fact]
    public async Task Runtime_IsolatesTwoPrivateVersions_AndResolvesSatelliteResources()
    {
        var folder = Folder();
        var graph = fixture.Build("Graph", "runtime-graph", "-p:FixtureDependencyVersion=2.0.0");
        var library = fixture.Build("Dependency", "runtime-library-v2", "-p:FixtureDependencyVersion=2.0.0");
        var source = new MemorySource([File.ReadAllBytes(graph), File.ReadAllBytes(library), File.ReadAllBytes(fixture.Embedded)]);
        var platform = HostPlatform.Current();
        var request = new PlanRequest(platform.Framework, platform.Rid, [new("Fixture.Graph", "[1.0.0]"),
            new("Fixture.Embedded", "[1.0.0]")]);

        var plan = await new PackagePlanner(source).PlanAsync(request, platform);
        await new PackageManager(folder, platform, source).RestoreLockedAsync(request, plan);
        using var runtime = PluginRuntime.Open(folder, platform);
        var graphType = runtime.PluginTypes.Single(x => x.Name == "GraphPlugin");
        var embeddedType = runtime.PluginTypes.Single(x => x.Name == "EmbeddedPlugin");
        var private1 = AssemblyLoadContext.GetLoadContext(embeddedType.Assembly)!.LoadFromAssemblyName(new AssemblyName("Vendor.Dependency"));

        var private2 = AssemblyLoadContext.GetLoadContext(graphType.Assembly)!.LoadFromAssemblyName(new AssemblyName("Vendor.Dependency"));
        Assert.Equal(1, private1.GetName().Version!.Major);
        Assert.Equal(2, private2.GetName().Version!.Major);
        Assert.NotSame(private1, private2);
        var resources = new ResourceManager("Graph.Strings", graphType.Assembly);
        Assert.Equal("Привет", resources.GetString("Hello", new CultureInfo("ru")));

        resources.ReleaseAllResources();
    }

    [Fact]
    public async Task Runtime_StartsHttpPlugins_AfterInstallationFromRepository()
    {
        var repository = Folder();

        foreach (var project in new[]
        {
            "ThinkingHome.Plugins.WebServer",
            "ThinkingHome.Plugins.WebServer.UrlValidation"
        }

        )
        {
            var pack = PackageFixture.Run("dotnet", typeof(PackageValidator).Assembly.Location, "pack",
                Path.Combine(fixture.Root, project, project + ".csproj"), repository);
            Assert.True(pack.Code == 0, pack.Output);
        }

        await using var server = RepositoryServer.Create(repository, "http://127.0.0.1:0");
        await server.StartAsync();

        try
        {
            using var http = new HttpClient(new HttpClientHandler { UseProxy = false });
            var source = new NuGetSourceClient(http, new() { PluginSources = [server.Urls.Single() + "/v3/index.json"] });
            var folder = Folder();
            var platform = HostPlatform.Current();
            await new PackageManager(folder, platform, source).InstallAsync("ThinkingHome.Plugins.WebServer.UrlValidation",
                "[4.0.0-alpha34]");
            File.WriteAllText(Path.Combine(folder, "appsettings.json"),
                "{\"plugins\":{\"ThinkingHome.Plugins.WebServer.WebServerPlugin\":{\"port\":0}}}");

            using var runtime = PluginRuntime.Open(folder, platform);
            var app = new HomeApplication();

            try
            {
                app.StartServices(new HomeConfiguration(folder), runtime.PluginTypes);
                var context = (IServiceContext)typeof(HomeApplication).GetField("context",
                    BindingFlags.Instance | BindingFlags.NonPublic)!.GetValue(app)!;
                var plugin = context.GetAllPlugins().Single(x => x.GetType().Name == "WebServerPlugin");
                var host = (IHost)plugin.GetType().GetField("host", BindingFlags.Instance | BindingFlags.NonPublic)!.GetValue(plugin)!;
                var address = host.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!.Addresses.Single();
                var port = new Uri(address).Port;

                var response = await http.GetStringAsync($"http://127.0.0.1:{port}/dynamic/web-server/url-validation/errors.txt");
                Assert.Empty(response);
            }
            finally
            {
                app.StopServices();
            }
        }
        finally
        {
            await server.StopAsync();
        }
    }

    private sealed class MemorySource(byte[][] bytes) : ILockedPackageSource
    {
        private static readonly Uri address = new("https://runtime-fixtures.invalid/v3/index.json");
        private readonly PackageDownload[] packages = bytes.Select(x => new PackageDownload(address, PackageMetadata.Read(x,
            false), x, PlanJson.Hash(x))).ToArray();

        public Task<PackageListing> FindAsync(PackageKind kind, string id, CancellationToken cancellation = default) =>
            Task.FromResult(new PackageListing(address, address, packages.Where(x => x.Metadata.Id.Equals(id,
            StringComparison.OrdinalIgnoreCase) && PackageFixture.IsPlugin(x.Bytes) == (kind == PackageKind.Plugin))
                .Select(x => x.Metadata.Version).ToArray()));

        public Task<PackageDownload> DownloadAsync(PackageKind kind, string id, NuGetVersion version,
            CancellationToken cancellation = default) => Task.FromResult(packages.Single(x => x.Metadata.Id.Equals(id,
            StringComparison.OrdinalIgnoreCase) && x.Metadata.Version == version));

        public Task<PackageDownload> DownloadLockedAsync(Uri source, PackageKind kind, string id, NuGetVersion version,
            CancellationToken cancellation = default) => DownloadAsync(kind, id, version, cancellation);
    }

    private async Task Install(string folder, PlatformCatalog platform, string[] packages, RootPlugin[] roots)
    {
        var source = new MemorySource(packages.Select(File.ReadAllBytes).ToArray());
        var request = new PlanRequest(platform.Framework, platform.Rid, roots);
        var plan = await new PackagePlanner(source).PlanAsync(request, platform);
        await new PackageManager(folder, platform, source).RestoreLockedAsync(request, plan);
    }

    [Fact]
    public void LocalOnly_ResolvesPluginReferences_AndRunsLifecycle_WithoutInstallation()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime");
        var timer = Path.Combine(Path.GetDirectoryName(dll)!, "ThinkingHome.Plugins.Timer.dll");
        Connect(folder, [dll, timer], [new("Fixture.Runtime", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, HostPlatform.Current());
        Assert.Null(runtime.State);

        Assert.Equal(2, runtime.PluginTypes.Count);
        var plugin = runtime.PluginTypes.Single(x => x.Name == "RuntimePlugin");
        var timerType = runtime.PluginTypes.Single(x => x.Name == "TimerPlugin");
        Assert.Same(timerType, plugin.GetConstructors().Single().GetParameters().Single().ParameterType);
        var app = new HomeApplication();

        try
        {
            app.StartServices(new HomeConfiguration(folder), runtime.PluginTypes);
        }
        finally
        {
            app.StopServices();
        }

        Assert.Equal("init:;start;stop;", plugin.GetProperty("Lifecycle")!.GetValue(null));
        Assert.False(Directory.Exists(Path.Combine(folder, ".thinkinghome")));
        Assert.Empty(Directory.GetFiles(Path.GetDirectoryName(dll)!, "*.nupkg"));
    }

    [Fact]
    public void Local_DoesNotConnectCopiedPluginsImplicitly()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime");
        Connect(folder, [dll], [new("Fixture.Runtime", "[1.0.0]")]);
        var error = Assert.Throws<ResolutionException>(() => PluginRuntime.Open(folder, HostPlatform.Current()));
        Assert.Contains("thinkinghome.plugins.timer", error.Message);
    }

    [Fact]
    public void Local_RejectsDuplicateIds_AndOrdinaryLibraryRoots()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime");
        Connect(folder, [dll, dll], [new("Fixture.Runtime", "[1.0.0]")]);
        Assert.Contains("Duplicate local plugin", Assert.Throws<ResolutionException>(() => PluginRuntime.Open(folder,
            HostPlatform.Current())).Message);
        Connect(folder, [Path.Combine(Path.GetDirectoryName(dll)!, "ThinkingHome.Core.Plugins.dll")],
            [new("ThinkingHome.Core.Plugins", "*")]);
        Assert.Throws<InvalidDataException>(() => PluginRuntime.Open(folder, HostPlatform.Current()));
    }

    [Fact]
    public async Task Local_InvalidOverrideDoesNotFallBackToInstalledVersion()
    {
        var folder = Folder();
        var timer = PackTimer(Folder());
        var package = fixture.Build("Runtime", "runtime-override");
        var platform = HostPlatform.Current();
        await Install(folder, platform, [timer, package], [new("Fixture.Runtime", "[1.0.0]")]);
        var pointer = File.ReadAllBytes(Path.Combine(folder, ".thinkinghome/current.json"));

        var replacement = BuildLocal("Runtime");
        Connect(folder, [replacement], []);
        using (var runtime = PluginRuntime.Open(folder, platform))
        {
            Assert.Equal(replacement, runtime.PluginTypes.Single(x => x.Name == "RuntimePlugin").Assembly.Location, ignoreCase: true);
        }

        // Меняем версию только фикстуры, не передавая глобальный Version её проектным зависимостям.
        var dll = BuildLocal("Runtime", "-p:RuntimeFixtureVersion=2.0.0");
        var core = Path.Combine(Path.GetDirectoryName(dll)!, "ThinkingHome.Core.Plugins.dll");
        Assert.Equal(typeof(PluginBase).Assembly.GetName().Version, AssemblyName.GetAssemblyName(core).Version);

        Connect(folder, [dll], []);
        Assert.Contains("Version conflict", Assert.Throws<ResolutionException>(() => PluginRuntime.Open(folder, platform)).Message);
        Assert.Equal(pointer, File.ReadAllBytes(Path.Combine(folder, ".thinkinghome/current.json")));
    }

    [Fact]
    public async Task LocalPathAloneDoesNotEnablePlugin_OrAlterInstalledRoots()
    {
        var folder = Folder();
        var platform = HostPlatform.Current();
        await Install(folder, platform, [PackTimer(Folder())], [new("ThinkingHome.Plugins.Timer", "[4.0.0-alpha34]")]);
        var dll = BuildLocal("Runtime");
        File.WriteAllBytes(Path.Combine(folder, "plugins.local.json"), PlanJson.Bytes(new { PluginPaths = new[] { dll } }));
        using var runtime = PluginRuntime.Open(folder, platform);

        Assert.Equal("TimerPlugin", Assert.Single(runtime.PluginTypes).Name);
    }

    [Fact]
    public void Local_StaticValidationRejectsPrivateTypesCrossingBoundary()
    {
        var folder = Folder();
        var dll = BuildLocal("Bad");
        Connect(folder, [dll], [new("Fixture.Bad", "[1.0.0]")]);
        Assert.Contains("crosses plugin boundary", Assert.Throws<ResolutionException>(() => PluginRuntime.Open(folder,
            HostPlatform.Current())).Message);
    }

    [Fact]
    public void Local_RejectsSharedAnnotationOnPluginReference()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime", "-p:SharedTimer=true");
        var timer = Path.Combine(Path.GetDirectoryName(dll)!, "ThinkingHome.Plugins.Timer.dll");
        Connect(folder, [dll, timer], [new("Fixture.Runtime", "[1.0.0]")]);
        Assert.Contains("Plugin cannot be marked shared", Assert.Throws<ResolutionException>(() =>
            PluginRuntime.Open(folder, HostPlatform.Current())).Message);
    }

    [Fact]
    public void Local_ResolvesPrivateLibraryAndSatellite_DirectlyFromBuildDirectory()
    {
        var folder = Folder();
        var dll = BuildLocal("Graph", "-p:FixtureDependencyVersion=2.0.0");
        Connect(folder, [dll], [new("Fixture.Graph", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, HostPlatform.Current());
        var type = runtime.PluginTypes.Single();
        var dependency = AssemblyLoadContext.GetLoadContext(type.Assembly)!.LoadFromAssemblyName(new AssemblyName("Vendor.Dependency"));

        Assert.Equal(2, dependency.GetName().Version!.Major);
        Assert.Equal(Path.GetDirectoryName(dll), Path.GetDirectoryName(dependency.Location));
        var resources = new ResourceManager("Graph.Strings", type.Assembly);
        Assert.Equal("Привет", resources.GetString("Hello", new CultureInfo("ru")));
        resources.ReleaseAllResources();
    }

    [Fact]
    public void Local_MissingBuildMetadataFailsBeforePluginCodeRuns()
    {
        var folder = Folder();
        var dll = BuildLocal("Runtime");
        File.Delete(Path.ChangeExtension(dll, ".deps.json"));
        Connect(folder, [dll], [new("Fixture.Runtime", "[1.0.0]")]);
        Assert.Throws<FileNotFoundException>(() => PluginRuntime.Open(folder, HostPlatform.Current()));
    }

    [Fact]
    public void Local_TwoPrivateVersionsRemainIsolated()
    {
        var folder = Folder();
        var graph = BuildLocal("Graph", "-p:FixtureDependencyVersion=2.0.0");
        fixture.Build("Dependency", "local-embedded-library", "-p:FixtureDependencyVersion=1.0.0");
        var embedded = BuildLocal("Embedded");
        Connect(folder, [graph, embedded], [new("Fixture.Graph", "[1.0.0]"), new("Fixture.Embedded", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, HostPlatform.Current());

        Assembly Dependency(string type) => AssemblyLoadContext.GetLoadContext(runtime.PluginTypes.Single(x =>
            x.Name == type).Assembly)!.LoadFromAssemblyName(new AssemblyName("Vendor.Dependency"));

        var first = Dependency("EmbeddedPlugin");
        var second = Dependency("GraphPlugin");
        Assert.Equal(1, first.GetName().Version!.Major);
        Assert.Equal(2, second.GetName().Version!.Major);
        Assert.NotSame(first, second);
    }

    [Fact]
    public void Local_SharedContractHasOneAssemblyIdentityAcrossPlugins()
    {
        var folder = Folder();
        var graph = BuildLocal("Graph", "-p:SharedDependency=true");
        var other = BuildLocal("Bad", "-p:SharedDependency=true");
        Connect(folder, [graph, other], [new("Fixture.Graph", "[1.0.0]"), new("Fixture.Bad", "[1.0.0]")]);
        using var runtime = PluginRuntime.Open(folder, HostPlatform.Current());
        var dependencies = runtime.PluginTypes.Select(x =>
            AssemblyLoadContext.GetLoadContext(x.Assembly)!.LoadFromAssemblyName(new AssemblyName("Vendor.Dependency"))).ToArray();

        Assert.Same(dependencies[0], dependencies[1]);
    }

    [Fact]
    public void Local_RejectsDifferentSharedContentEvenAtSameVersion()
    {
        var folder = Folder();
        var graph = BuildLocal("Graph", "-p:SharedDependency=true");
        var other = BuildLocal("Bad", "-p:SharedDependency=true");
        var library = Path.Combine(Path.GetDirectoryName(other)!, "Vendor.Dependency.dll");
        File.WriteAllBytes(library, File.ReadAllBytes(library).Concat(new byte[] { 0 }).ToArray());
        Connect(folder, [graph, other], [new("Fixture.Graph", "[1.0.0]"), new("Fixture.Bad", "[1.0.0]")]);

        Assert.Contains("Shared dependency content differs", Assert.Throws<ResolutionException>(() =>
            PluginRuntime.Open(folder, HostPlatform.Current())).Message);
    }

    [Fact]
    public void Local_RealDatabaseAndScriptsShareEfContract_AndBuildModelWithoutConnecting()
    {
        var folder = Folder();
        var output = Folder();
        var build = PackageFixture.Run("dotnet", "build", Path.Combine(fixture.Root,
            "ThinkingHome.Plugins.Scripts/ThinkingHome.Plugins.Scripts.csproj"), "-o", output, "-m:1",
            "-p:UseSharedCompilation=false", "-p:NuGetAudit=false");
        Assert.True(build.Code == 0, build.Output);
        Connect(folder, [Path.Combine(output, "ThinkingHome.Plugins.Database.dll"), Path.Combine(output,
            "ThinkingHome.Plugins.Scripts.dll")], [new("ThinkingHome.Plugins.Scripts", "[4.0.0-alpha34]")]);

        // EF/framework caches can retain collectible contexts; a real host releases them on process exit.
        var probe = Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests/Fixtures/RuntimeProbe/RuntimeProbe.csproj");
        var compiled = PackageFixture.Run("dotnet", "build", probe, "-m:1", "-p:UseSharedCompilation=false", "-p:NuGetAudit=false");
        Assert.True(compiled.Code == 0, compiled.Output);
        var result = PackageFixture.Run("dotnet", Path.Combine(Path.GetDirectoryName(probe)!,
            "bin/Debug/net10.0/RuntimeProbe.dll"), folder);
        Assert.True(result.Code == 0, result.Output);

        Assert.Contains("EF shared identity and model verified", result.Output);
    }

    private string BuildLocal(string project, params string[] extra)
    {
        var output = Folder();
        var result = PackageFixture.Run("dotnet", new[] { "build", Path.Combine(fixture.Root,
            "ThinkingHome.Packaging.Tests/Fixtures", project, project + ".csproj"), "-c", "Debug", "-o", output, "-m:1",
            "-p:UseSharedCompilation=false", "-p:NuGetAudit=false" }.Concat(extra).ToArray());
        Assert.True(result.Code == 0, result.Output);

        return Path.Combine(output, project + ".dll");
    }

    private static void Connect(string folder, string[] paths, RootPlugin[] roots) =>
        File.WriteAllBytes(Path.Combine(folder, "plugins.local.json"), PlanJson.Bytes(new
        {
            PluginPaths = paths.Select(x => Path.GetRelativePath(folder, x)).ToArray(),
            Plugins = roots
        }));
}
