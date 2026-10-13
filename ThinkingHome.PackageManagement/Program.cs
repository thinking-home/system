using ThinkingHome.PackageManagement;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;

if (args.Length == 0 || !((args[0] == "install" && args.Length == 6) || (args[0] == "ci" && args.Length == 6) ||
    (args[0] == "validate" && args.Length == 3) || (args[0] == "recover" && args.Length == 3))) {
    Console.Error.WriteLine("Usage:\n  install <app-directory> <plugin-id> <version-range> <platform.json> <sources.json>\n" +
        "  ci <app-directory> <plugins.json> <plan-directory> <platform.json> <sources.json>\n" +
        "  validate <app-directory> <platform.json>\n  recover <app-directory> <platform.json>");
    return 2;
}
try {
    var platformFile = Path.GetFullPath(args[0] is "install" or "ci" ? args[4] : args[2]);
    var platform = PlanJson.Read<PlatformCatalog>(platformFile);
    platform = platform with { Assemblies = platform.Assemblies.Select(x => Path.GetFullPath(x, Path.GetDirectoryName(platformFile)!)).ToArray() };
    using var http = new HttpClient();
    var source = args[0] is "install" or "ci" ? new NuGetSourceClient(http, SourceConfiguration.Read(args[5])) : null;
    var manager = new PackageManager(args[1], platform, source);
    using var cancellation = new CancellationTokenSource();
    Console.CancelKeyPress += (_, e) => { e.Cancel = true; cancellation.Cancel(); };
    InstalledState? state = null;
    switch (args[0]) {
        case "install": state = await manager.InstallAsync(args[2], args[3], cancellation.Token); break;
        case "ci":
            var plan = new InstallationPlan(PlanJson.Read<PluginLock>(Path.Combine(args[3], "plugins.lock.json")),
                PlanJson.Read<LoadMap>(Path.Combine(args[3], "load-map.json")));
            state = await manager.RestoreLockedAsync(PlanJson.Read<PlanRequest>(args[2]), plan, cancellation.Token);
            break;
        case "validate": state = manager.Validate(cancellation.Token); break;
        case "recover": manager.Recover(); Console.WriteLine("Pending transaction recovered"); break;
    }
    if (state != null) Console.WriteLine($"{args[0]} succeeded: {state.Plan.Lock.Packages.Length} packages\nState: {state.Directory}\nPlugins apply after application restart");
    return 0;
} catch (Exception ex) {
    Console.Error.WriteLine(ex.Message);
    return 1;
}
