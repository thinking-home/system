using NuGet.Versioning;
using ThinkingHome.PackageSources;

try {
    if (args.Length is not (4 or 6) || args[1] is not ("plugin" or "library") ||
        (args[0] == "versions" ? args.Length != 4 : args[0] != "download" || args.Length != 6)) {
        Console.Error.WriteLine("Usage: versions <plugin|library> <sources.json> <id>\n"
            + "       download <plugin|library> <sources.json> <id> <version> <output-directory>");
        return 2;
    }
    var kind = args[1] == "plugin" ? PackageKind.Plugin : PackageKind.Library;
    using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(60) };
    var client = new NuGetSourceClient(http, SourceConfiguration.Read(args[2]));
    if (args[0] == "versions") {
        var listing = await client.FindAsync(kind, args[3]);
        Console.WriteLine("Source: " + listing.Source);
        foreach (var version in listing.Versions) Console.WriteLine(version.ToNormalizedString());
    } else Console.WriteLine(await client.DownloadToAsync(kind, args[3], NuGetVersion.Parse(args[4]), args[5]));
    return 0;
} catch (Exception exception) {
    Console.Error.WriteLine("Package source failed: " + exception.Message);
    return 1;
}
