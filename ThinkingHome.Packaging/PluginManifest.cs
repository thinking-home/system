using System.Reflection;
using NuGet.Versioning;

namespace ThinkingHome.Packaging;

public sealed record PluginManifest(string PackageId, NuGetVersion Version, string PlatformRange,
    string[] EntryPoints, Dictionary<string, string> Dependencies, Dictionary<string, string> Embedded) {
    public const string Prefix = "ThinkingHome.Plugin.";

    public static PluginManifest Read(Assembly assembly) {
        var fields = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var attribute in assembly.GetCustomAttributesData()) {
            if (attribute.AttributeType.FullName != typeof(AssemblyMetadataAttribute).FullName) continue;
            if (attribute.ConstructorArguments.Count != 2) continue;
            var key = attribute.ConstructorArguments[0].Value as string;
            if (key == null || !key.StartsWith(Prefix, StringComparison.Ordinal)) continue;
            var value = attribute.ConstructorArguments[1].Value as string;
            Require(!string.IsNullOrWhiteSpace(value), $"Empty manifest value: {key}");
            Require(fields.TryAdd(key[Prefix.Length..], value!), $"Duplicate manifest key: {key}");
        }
        return FromFields(fields);
    }

    public static PluginManifest FromFields(Dictionary<string, string> fields) {
        string Required(string key) => fields.TryGetValue(key, out var value) ? value
            : throw new InvalidDataException($"Missing plugin metadata: {Prefix}{key}");
        Require(Required("ManifestVersion") == "1", "Unsupported plugin manifest version");
        var id = Required("PackageId");
        Require(System.Text.RegularExpressions.Regex.IsMatch(id, @"^[A-Za-z0-9_][A-Za-z0-9_.-]*$"), "Invalid package ID");
        Require(NuGetVersion.TryParse(Required("PackageVersion"), out var version), "Invalid package version");
        var platform = Required("PlatformRange");
        Require(VersionRange.TryParse(platform, out _), "Invalid platform version range");
        var entries = new List<string>();
        var dependencies = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var embedded = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (key, value) in fields) {
            if (key is "ManifestVersion" or "PackageId" or "PackageVersion" or "PlatformRange") continue;
            if (key.StartsWith("EntryPoint.", StringComparison.Ordinal)) {
                Require(value == "plugin" && key.Length > 11, $"Invalid entry point: {key}");
                entries.Add(key[11..]);
            } else if (key.StartsWith("Dependency.", StringComparison.Ordinal)) {
                Require(value is "plugin" or "shared" or "private", $"Invalid dependency kind: {key}={value}");
                Require(key.Length > 11, "Empty dependency ID");
                dependencies.Add(key[11..], value);
            } else if (key.StartsWith("Embedded.", StringComparison.Ordinal)) {
                Require(value is "shared" or "private", $"Invalid embedded kind: {key}={value}");
                Require(key.Length > 9, "Empty embedded assembly name");
                embedded.Add(key[9..], value);
            } else throw new InvalidDataException($"Unknown plugin metadata: {key}");
        }
        Require(entries.Count > 0, "No plugin entry points");
        return new(id, version!, platform, entries.ToArray(), dependencies, embedded);
    }

    internal static void Require(bool condition, string message) {
        if (!condition) throw new InvalidDataException(message);
    }
}
