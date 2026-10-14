using ThinkingHome.Platform;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;

if (args.Length != 5 || args[0] != "plan")
{
    Console.Error.WriteLine("Usage: ThinkingHome.PackagePlanning plan <plugins.json> <platform.json> <sources.json> <new-output-directory>");
    return 2;
}
string? staging = null;
try
{
    var destination = Path.GetFullPath(args[4]);
    if (Directory.Exists(destination) || File.Exists(destination)) throw new IOException("Output already exists: " + destination);
    var request = PlanJson.Read<PlanRequest>(args[1]);
    var platform = PlanJson.Read<PlatformCatalog>(args[2]);
    var catalogDirectory = Path.GetDirectoryName(Path.GetFullPath(args[2]))!;
    platform = platform with { Assemblies = platform.Assemblies.Select(x => Path.GetFullPath(x, catalogDirectory)).ToArray() };
    using var http = new HttpClient();
    var planner = new PackagePlanner(new NuGetSourceClient(http, SourceConfiguration.Read(args[3])));
    var result = await planner.PlanAsync(request, platform);
    var parent = Path.GetDirectoryName(destination)!;
    Directory.CreateDirectory(parent);
    staging = Path.Combine(parent, ".plan-" + Guid.NewGuid().ToString("N"));
    Directory.CreateDirectory(staging);
    await File.WriteAllBytesAsync(Path.Combine(staging, "plugins.lock.json"), PlanJson.Bytes(result.Lock));
    await File.WriteAllBytesAsync(Path.Combine(staging, "load-map.json"), PlanJson.Bytes(result.LoadMap));
    Directory.Move(staging, destination);
    Console.WriteLine($"Validated {result.Lock.Packages.Length} packages; plan written to {destination}");
    return 0;
}
catch (Exception ex)
{
    Console.Error.WriteLine(ex.Message);
    return 1;
}
finally
{
    if (staging != null && Directory.Exists(staging)) Directory.Delete(staging, recursive: true);
}
