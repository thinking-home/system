using NuGet.Versioning;
using ThinkingHome.PackageSources;

try {
    if (args.Length is not (3 or 5) ||
        (args[0] == "versions" ? args.Length != 3 : args[0] != "download" || args.Length != 5)) {
        Console.Error.WriteLine("Usage: versions <sources.json> <id>\n"
            + "       download <sources.json> <id> <version> <output-directory>");
        return 2;
    }
    using var http = new HttpClient { Timeout = TimeSpan.FromSeconds(60) };
    var client = new NuGetSourceClient(http, SourceConfiguration.Read(args[1]));
    if (args[0] == "versions") {
        var listing = await client.FindAsync(args[2]);
        Console.WriteLine("Source: " + listing.Source);
        foreach (var version in listing.Versions) Console.WriteLine(version.ToNormalizedString());
    } else Console.WriteLine(await client.DownloadToAsync(args[2], NuGetVersion.Parse(args[3]), args[4]));
    return 0;
} catch (Exception exception) {
    Console.Error.WriteLine("Package source failed: " + exception.Message);
    return 1;
}
