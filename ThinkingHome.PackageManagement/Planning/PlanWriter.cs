using ThinkingHome.PackageSources;
using ThinkingHome.Platform;

namespace ThinkingHome.PackagePlanning;

public static class PlanWriter
{
    public static async Task<InstallationPlan> WriteAsync(string roots, string catalog, string sources, string directory)
    {
        var destination = Path.GetFullPath(directory);
        if (Directory.Exists(destination) || File.Exists(destination)) throw new IOException("Output already exists: " + destination);
        var request = PlanJson.Read<PlanRequest>(roots);
        var platform = PlanJson.Read<PlatformCatalog>(catalog);
        var catalogDirectory = Path.GetDirectoryName(Path.GetFullPath(catalog))!;
        platform = platform with { Assemblies = platform.Assemblies.Select(path => Path.GetFullPath(path, catalogDirectory)).ToArray() };
        using var http = new HttpClient();
        var planner = new PackagePlanner(new NuGetSourceClient(http, SourceConfiguration.Read(sources)));
        var result = await planner.PlanAsync(request, platform);
        var parent = Path.GetDirectoryName(destination)!;
        Directory.CreateDirectory(parent);
        var staging = Path.Combine(parent, ".plan-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(staging);
        try
        {
            await File.WriteAllBytesAsync(Path.Combine(staging, "plugins.lock.json"), PlanJson.Bytes(result.Lock));
            await File.WriteAllBytesAsync(Path.Combine(staging, "load-map.json"), PlanJson.Bytes(result.LoadMap));
            Directory.Move(staging, destination);
            return result;
        }
        finally
        {
            if (Directory.Exists(staging)) Directory.Delete(staging, recursive: true);
        }
    }
}
