using System.CommandLine;
using NuGet.Versioning;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;

namespace ThinkingHome.Console;

internal static class DiagnosticCommands
{
    internal static void Configure(Command root)
    {
        var sources = new Argument<string>("sources.json");
        var id = new Argument<string>("package-id");
        var versions = new Command("versions", "List package versions.") { Arguments = { sources, id } };
        versions.SetAction(result => Execute(async () =>
        {
            using var http = new HttpClient();
            var client = new NuGetSourceClient(http, SourceConfiguration.Read(result.GetValue(sources)!));
            var listing = await client.FindAsync(result.GetValue(id)!);
            System.Console.WriteLine("Source: " + listing.Source);
            foreach (var item in listing.Versions) System.Console.WriteLine(item.ToNormalizedString());
        }));
        root.Subcommands.Add(versions);

        var feed = new Argument<string>("sources.json");
        var package = new Argument<string>("package-id");
        var version = new Argument<string>("version");
        var output = new Argument<string>("output-directory");
        var download = new Command("download", "Download a verified package.") { Arguments = { feed, package, version, output } };
        download.SetAction(result => Execute(async () =>
        {
            using var http = new HttpClient();
            var client = new NuGetSourceClient(http, SourceConfiguration.Read(result.GetValue(feed)!));
            System.Console.WriteLine(await client.DownloadToAsync(result.GetValue(package)!, NuGetVersion.Parse(result.GetValue(version)!), result.GetValue(output)!));
        }));
        root.Subcommands.Add(download);

        var roots = new Argument<string>("plugins.json");
        var catalog = new Argument<string>("platform.json");
        var repositories = new Argument<string>("sources.json");
        var destination = new Argument<string>("new-output-directory");
        var plan = new Command("plan", "Plan an installation against an explicit platform catalog.")
            { Arguments = { roots, catalog, repositories, destination } };
        plan.SetAction(result => Execute(async () =>
        {
            var directory = result.GetValue(destination)!;
            var written = await PlanWriter.WriteAsync(result.GetValue(roots)!, result.GetValue(catalog)!, result.GetValue(repositories)!, directory);
            System.Console.WriteLine($"Validated {written.Lock.Packages.Length} packages; plan written to {directory}");
        }));
        root.Subcommands.Add(plan);
    }

    private static async Task<int> Execute(Func<Task> action)
    {
        try { await action(); return 0; }
        catch (Exception ex) { System.Console.Error.WriteLine(ex.Message); return 1; }
    }
}
