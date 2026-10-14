using System.Reflection;
using NuGet.Versioning;

namespace ThinkingHome.Packaging;

/// <summary>
/// Идентичность плагина и классификация зависимостей; диапазоны версий задаются обычными зависимостями NuGet.
/// </summary>
public sealed record PluginManifest(string PackageId, NuGetVersion Version,
    Dictionary<string, string> Dependencies, Dictionary<string, string> Embedded)
{
    /// <summary>Префикс ключей метаданных плагина в AssemblyMetadataAttribute.</summary>
    public const string Prefix = "ThinkingHome.Plugin.";

    /// <summary>Читает манифест из атрибутов сборки без выполнения конструкторов атрибутов.</summary>
    public static PluginManifest Read(Assembly assembly)
    {
        var fields = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var attribute in assembly.GetCustomAttributesData())
        {
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

    /// <summary>Проверяет и преобразует поля манифеста, прочитанные из метаданных DLL.</summary>
    public static PluginManifest FromFields(Dictionary<string, string> fields)
    {
        string Required(string key) => fields.TryGetValue(key, out var value) ? value
            : throw new InvalidDataException($"Missing plugin metadata: {Prefix}{key}");
        Require(Required("ManifestVersion") == "1", "Unsupported plugin manifest version");
        var id = Required("PackageId");
        Require(System.Text.RegularExpressions.Regex.IsMatch(id, @"^[A-Za-z0-9_][A-Za-z0-9_.-]*$"), "Invalid package ID");
        Require(NuGetVersion.TryParse(Required("PackageVersion"), out var version), "Invalid package version");
        var dependencies = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        var embedded = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        foreach (var (key, value) in fields)
        {
            if (key is "ManifestVersion" or "PackageId" or "PackageVersion") continue;
            if (key.StartsWith("Dependency.", StringComparison.Ordinal))
            {
                Require(value is "plugin" or "shared" or "private", $"Invalid dependency kind: {key}={value}");
                Require(key.Length > 11, "Empty dependency ID");
                dependencies.Add(key[11..], value);
            }
            else if (key.StartsWith("Embedded.", StringComparison.Ordinal))
            {
                Require(value is "shared" or "private", $"Invalid embedded kind: {key}={value}");
                Require(key.Length > 9, "Empty embedded assembly name");
                embedded.Add(key[9..], value);
            }
            else throw new InvalidDataException($"Unknown plugin metadata: {key}");
        }
        return new(id, version!, dependencies, embedded);
    }

    internal static void Require(bool condition, string message)
    {
        if (!condition) throw new InvalidDataException(message);
    }
}
