using ThinkingHome.Packaging;

namespace ThinkingHome.Repository;

public static class RepositoryServer {
    public static WebApplication Create(string folder, string url) {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = [] });
        builder.WebHost.UseUrls(url);
        builder.Services.AddSingleton(_ => new RepositoryCatalog(folder));
        var app = builder.Build();
        var catalog = app.Services.GetRequiredService<RepositoryCatalog>();
        app.MapMethods("/v3/index.json", ["GET", "HEAD"], (HttpRequest request) => Results.Json(new {
            version = "3.0.0", resources = new[] { new Dictionary<string, string> {
                ["@id"] = $"{request.Scheme}://{request.Host}{request.PathBase}/v3/flat/",
                ["@type"] = "PackageBaseAddress/3.0.0"
            } }
        }));
        app.MapMethods("/v3/flat/{id}/index.json", ["GET", "HEAD"], (string id) => {
            var versions = catalog.Packages.Values.Where(x => string.Equals(x.Metadata.Id, id, StringComparison.OrdinalIgnoreCase))
                .OrderBy(x => x.Metadata.Version).Select(x => PackageMetadata.NormalizeVersion(x.Metadata.Version)).ToArray();
            return versions.Length == 0 ? Results.NotFound() : Results.Json(new { versions });
        });
        app.MapMethods("/v3/flat/{id}/{version}/{file}", ["GET", "HEAD"], (string id, string version, string file, HttpResponse response) => {
            if (!catalog.Packages.TryGetValue(RepositoryCatalog.Key(id, version), out var package)) return Results.NotFound();
            var lowerId = id.ToLowerInvariant();
            if (file == $"{lowerId}.{version}.nupkg") {
                response.Headers.ETag = "\"" + package.Hash + "\"";
                return Results.Bytes(package.Bytes, "application/octet-stream");
            }
            return file == lowerId + ".nuspec" ? Results.Bytes(package.Metadata.Nuspec, "application/xml") : Results.NotFound();
        });
        return app;
    }
}
