using System.Net;
using System.Security.Cryptography;
using System.Text.Json;
using System.Text.RegularExpressions;
using NuGet.Versioning;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackageSources;

public sealed record PackageListing(Uri Source, Uri ContentBase, IReadOnlyList<NuGetVersion> Versions);
public sealed record PackageDownload(Uri Source, PackageMetadata Metadata, byte[] Bytes, string Sha512);

public sealed class NuGetSourceClient(HttpClient http, SourceConfiguration configuration) {
    public async Task<PackageListing> FindAsync(PackageKind kind, string id, CancellationToken cancellation = default) {
        ValidateId(id);
        foreach (var source in configuration.GetSources(kind)) {
            var listing = await GetListing(source, id, cancellation);
            if (listing != null) return listing;
        }
        throw new KeyNotFoundException($"Package {id} not found in {kind} sources");
    }

    public async Task<PackageDownload> DownloadAsync(PackageKind kind, string id, NuGetVersion version,
        CancellationToken cancellation = default) {
        var selected = await FindAsync(kind, id, cancellation);
        if (!selected.Versions.Contains(version)) throw new KeyNotFoundException($"Version {version} is absent from selected source {selected.Source}");
        var bytes = await GetPackage(selected, id, version, cancellation);
        var metadata = PackageMetadata.Read(bytes, requirePlugin: kind == PackageKind.Plugin);
        if (!string.Equals(metadata.Id, id, StringComparison.OrdinalIgnoreCase) || metadata.Version != version)
            throw new InvalidDataException("Downloaded package identity differs from requested identity");
        var hash = Convert.ToHexString(SHA512.HashData(bytes));
        // Проверяем одинаковую identity в других источниках выбранной группы, не меняя победителя.
        foreach (var source in configuration.GetSources(kind).Where(x => x != selected.Source)) {
            var other = await GetListing(source, id, cancellation);
            if (other == null || !other.Versions.Contains(version)) continue;
            var otherBytes = await GetPackage(other, id, version, cancellation);
            if (Convert.ToHexString(SHA512.HashData(otherBytes)) != hash)
                throw new InvalidDataException($"Conflicting content for {id}/{version}: {selected.Source} and {source}");
        }
        return new(selected.Source, metadata, bytes, hash);
    }

    public async Task<string> DownloadToAsync(PackageKind kind, string id, NuGetVersion version, string directory,
        CancellationToken cancellation = default) {
        var download = await DownloadAsync(kind, id, version, cancellation);
        directory = Path.GetFullPath(directory);
        Directory.CreateDirectory(directory);
        var destination = Path.Combine(directory, id.ToLowerInvariant() + "." + PackageMetadata.NormalizeVersion(version) + ".nupkg");
        var temporary = Path.Combine(directory, ".download-" + Guid.NewGuid().ToString("N"));
        try {
            await File.WriteAllBytesAsync(temporary, download.Bytes, cancellation);
            cancellation.ThrowIfCancellationRequested();
            File.Move(temporary, destination, overwrite: false);
        } finally { if (File.Exists(temporary)) File.Delete(temporary); }
        return destination;
    }

    private async Task<PackageListing?> GetListing(Uri source, string id, CancellationToken cancellation) {
        using var index = JsonDocument.Parse((await GetBytes(source, 4 * 1024 * 1024, false, cancellation))!);
        if (!NuGetVersion.TryParse(index.RootElement.GetProperty("version").GetString(), out var protocol) || protocol.Major != 3)
            throw new InvalidDataException("Unsupported NuGet service index: " + source);
        var resource = index.RootElement.GetProperty("resources").EnumerateArray().FirstOrDefault(x =>
            x.GetProperty("@type").GetString() == "PackageBaseAddress/3.0.0");
        if (resource.ValueKind == JsonValueKind.Undefined) throw new InvalidDataException("PackageBaseAddress/3.0.0 missing: " + source);
        var address = SourceConfiguration.HttpUri(resource.GetProperty("@id").GetString()!);
        if (!address.AbsoluteUri.EndsWith('/')) address = new Uri(address.AbsoluteUri + "/");
        var content = await GetBytes(new Uri(address, id.ToLowerInvariant() + "/index.json"), 4 * 1024 * 1024, true, cancellation);
        if (content == null) return null;
        using var versions = JsonDocument.Parse(content);
        var values = versions.RootElement.GetProperty("versions").EnumerateArray()
            .Select(x => NuGetVersion.Parse(x.GetString()!)).Distinct().Order().ToArray();
        return values.Length == 0 ? null : new(source, address, values);
    }

    private async Task<byte[]> GetPackage(PackageListing source, string id, NuGetVersion version, CancellationToken cancellation) {
        var lower = id.ToLowerInvariant();
        var normalized = PackageMetadata.NormalizeVersion(version);
        return (await GetBytes(new Uri(source.ContentBase, $"{lower}/{normalized}/{lower}.{normalized}.nupkg"),
            64 * 1024 * 1024, false, cancellation))!;
    }

    private async Task<byte[]?> GetBytes(Uri uri, int limit, bool allowNotFound, CancellationToken cancellation) {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(cancellation);
        timeout.CancelAfter(TimeSpan.FromSeconds(60));
        cancellation = timeout.Token;
        using var response = await http.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead, cancellation);
        if (allowNotFound && response.StatusCode == HttpStatusCode.NotFound) return null;
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"Package source returned {(int)response.StatusCode}: {uri}", null, response.StatusCode);
        if (response.Content.Headers.ContentLength > limit) throw new InvalidDataException("Source response is too large: " + uri);
        await using var input = await response.Content.ReadAsStreamAsync(cancellation);
        using var output = new MemoryStream();
        var buffer = new byte[81920];
        int count;
        while ((count = await input.ReadAsync(buffer, cancellation)) > 0) {
            if (output.Length + count > limit) throw new InvalidDataException("Source response is too large: " + uri);
            output.Write(buffer, 0, count);
        }
        return output.ToArray();
    }

    private static void ValidateId(string id) {
        if (!Regex.IsMatch(id, @"^[A-Za-z0-9_][A-Za-z0-9_.-]*$")) throw new ArgumentException("Invalid package ID", nameof(id));
    }
}
