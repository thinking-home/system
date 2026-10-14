using System.CommandLine;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;
using ThinkingHome.Platform;

var command = new RootCommand("ThinkingHome plugin package manager");
command.Subcommands.Add(InstallCommand());
command.Subcommands.Add(RestoreCommand());
command.Subcommands.Add(OfflineCommand("validate", "Validate the installed state without network access."));
command.Subcommands.Add(OfflineCommand("recover", "Recover an interrupted installation."));

var parsed = command.Parse(args);
var exitCode = await parsed.InvokeAsync();
return parsed.Errors.Count > 0 ? 2 : exitCode;

static Command InstallCommand()
{
    var app = new Argument<string>("app-directory");
    var plugin = new Argument<string>("plugin-id");
    var version = new Argument<string>("version-range");
    var sources = new Argument<string>("sources.json");
    var command = new Command("install", "Install a root plugin and its dependencies.")
    {
        Arguments = { app, plugin, version, sources }
    };

    command.SetAction(result => Execute("install", result.GetValue(app)!, result.GetValue(sources),
        async (manager, cancellation) => await manager.InstallAsync(
            result.GetValue(plugin)!, result.GetValue(version)!, cancellation)));

    return command;
}

static Command RestoreCommand()
{
    var app = new Argument<string>("app-directory");
    var declaration = new Argument<string>("plugins.json");
    var directory = new Argument<string>("plan-directory");
    var sources = new Argument<string>("sources.json");
    var command = new Command("ci", "Restore the exact locked dependencies.")
    {
        Arguments = { app, declaration, directory, sources }
    };

    command.SetAction(result => Execute("ci", result.GetValue(app)!, result.GetValue(sources),
        async (manager, cancellation) =>
        {
            var planDirectory = result.GetValue(directory)!;
            var plan = new InstallationPlan(
                PlanJson.Read<PluginLock>(Path.Combine(planDirectory, "plugins.lock.json")),
                PlanJson.Read<LoadMap>(Path.Combine(planDirectory, "load-map.json")));

            return await manager.RestoreLockedAsync(
                PlanJson.Read<PlanRequest>(result.GetValue(declaration)!), plan, cancellation);
        }));

    return command;
}

static Command OfflineCommand(string operation, string description)
{
    var app = new Argument<string>("app-directory");
    var command = new Command(operation, description) { Arguments = { app } };
    command.SetAction(result => Execute(operation, result.GetValue(app)!, null,
        (manager, cancellation) =>
        {
            if (operation == "validate")
            {
                return Task.FromResult<InstalledState?>(manager.Validate(cancellation));
            }

            manager.Recover();
            Console.WriteLine("Pending transaction recovered");
            return Task.FromResult<InstalledState?>(null);
        }));

    return command;
}

static async Task<int> Execute(string operation, string directory, string? sources,
    Func<PackageManager, CancellationToken, Task<InstalledState?>> action)
{
    using var cancellation = new CancellationTokenSource();
    ConsoleCancelEventHandler cancel = (_, e) =>
    {
        e.Cancel = true;
        cancellation.Cancel();
    };
    Console.CancelKeyPress += cancel;

    try
    {
        // Обе программы поставляются вместе и получают платформу из общего API своего процесса.
        var platform = HostPlatform.Current();
        using var http = new HttpClient();
        var source = sources == null ? null : new NuGetSourceClient(http, SourceConfiguration.Read(sources));
        var manager = new PackageManager(directory, platform, source);
        var state = await action(manager, cancellation.Token);

        if (state != null)
        {
            Console.WriteLine($"{operation} succeeded: {state.Plan.Lock.Packages.Length} packages\n" +
                $"State: {state.Directory}\nPlugins apply after application restart");
        }

        return 0;
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine(ex.Message);
        return 1;
    }
    finally
    {
        Console.CancelKeyPress -= cancel;
    }
}
