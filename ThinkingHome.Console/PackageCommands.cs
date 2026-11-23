using ThinkingHome.PackageManagement;
using System.CommandLine;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;
using ThinkingHome.Platform;

namespace ThinkingHome.Console;

internal static class PackageCommands
{
    public static void Configure(Command command)
    {
        DiagnosticCommands.Configure(command);
        command.Subcommands.Add(InstallCommand());
        command.Subcommands.Add(UninstallCommand());
        command.Subcommands.Add(RestoreCommand());
        command.Subcommands.Add(OfflineCommand("validate", "Validate the installed state without network access."));
        command.Subcommands.Add(OfflineCommand("recover", "Recover an interrupted installation."));
    }

    private static Command InstallCommand()
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

    private static Command UninstallCommand()
    {
        var app = new Argument<string>("app-directory");
        var plugin = new Argument<string>("plugin-id");
        var command = new Command("uninstall", "Remove a plugin unless another installed plugin requires it.")
        {
            Arguments = { app, plugin }
        };

        command.SetAction(result => Execute("uninstall", result.GetValue(app)!, null,
            async (manager, cancellation) => await manager.RemoveAsync(result.GetValue(plugin)!, cancellation)));

        return command;
    }

    private static Command RestoreCommand()
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

    private static Command OfflineCommand(string operation, string description)
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
                System.Console.WriteLine("Pending transaction recovered");
                return Task.FromResult<InstalledState?>(null);
            }));

        return command;
    }

    private static async Task<int> Execute(string operation, string directory, string? sources,
        Func<PackageManager, CancellationToken, Task<InstalledState?>> action)
    {
        using var cancellation = new CancellationTokenSource();
        ConsoleCancelEventHandler cancel = (_, e) =>
        {
            e.Cancel = true;
            cancellation.Cancel();
        };
        System.Console.CancelKeyPress += cancel;

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
                System.Console.WriteLine($"{operation} succeeded: {state.Plan.Lock.Packages.Length} packages\n" +
                    $"State: {state.Directory}\nPlugins apply after application restart");
            }

            return 0;
        }
        catch (Exception ex)
        {
            System.Console.Error.WriteLine(ex.Message);
            return 1;
        }
        finally
        {
            System.Console.CancelKeyPress -= cancel;
        }
    }
}
