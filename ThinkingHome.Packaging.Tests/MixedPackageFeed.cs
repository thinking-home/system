using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Packaging;

namespace ThinkingHome.Packaging.Tests;

// Общий NuGet V3 feed для сквозных тестов. Продуктовый Repository намеренно принимает только плагины.
internal static class MixedPackageFeed {
    internal static WebApplication Create(params byte[][] archives) {
        var packages = archives.ToDictionary(bytes =>
        {
            var metadata = PackageMetadata.Read(bytes);
            return metadata.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(metadata.Version);
        });
        var app = WebApplication.CreateBuilder().Build();
        app.Urls.Add("http://127.0.0.1:0");
        app.MapGet("/v3/index.json", (HttpRequest request) => Results.Json(new
        {
            version = "3.0.0",
            resources = new[] { new Dictionary<string, string>
            {
                ["@id"] = $"{request.Scheme}://{request.Host}/flat/",
                ["@type"] = "PackageBaseAddress/3.0.0"
            } }
        }));
        app.MapGet("/flat/{id}/index.json", (string id) =>
        {
            var versions = packages.Keys.Where(key => key.StartsWith(id + "/", StringComparison.Ordinal))
                .Select(key => key.Split('/')[1]).ToArray();
            return versions.Length == 0 ? Results.NotFound() : Results.Json(new { versions });
        });
        app.MapGet("/flat/{id}/{version}/{file}", (string id, string version, string file) =>
            file == $"{id}.{version}.nupkg" && packages.TryGetValue(id + "/" + version, out var bytes)
                ? Results.Bytes(bytes, "application/octet-stream") : Results.NotFound());
        return app;
    }
}
