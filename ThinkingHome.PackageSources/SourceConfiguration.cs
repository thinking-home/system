using System.Text.Json;
using System.Text.Json.Serialization;

namespace ThinkingHome.PackageSources;

public enum PackageKind { Plugin, Library }

public sealed class SourceConfiguration {
    public string[] PluginSources { get; init; } = [];
    public string[] LibrarySources { get; init; } = [];

    public static SourceConfiguration Read(string path) => JsonSerializer.Deserialize<SourceConfiguration>(File.ReadAllText(path),
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true, UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow })
        ?? throw new InvalidDataException("Empty source configuration");

    public Uri[] GetSources(PackageKind kind) {
        var values = kind == PackageKind.Plugin ? PluginSources : LibrarySources;
        if (values == null) throw new InvalidDataException("Source list must not be null");
        var sources = values.Select(value => HttpUri(value)).ToArray();
        if (sources.Distinct().Count() != sources.Length) throw new InvalidDataException("Duplicate package source");
        return sources;
    }

    internal static Uri HttpUri(string value) {
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri) || uri.Scheme is not ("http" or "https") ||
            uri.Fragment.Length != 0 || uri.UserInfo.Length != 0)
            throw new InvalidDataException("Expected an absolute HTTP(S) URL without fragment or embedded credentials");
        return uri;
    }
}
