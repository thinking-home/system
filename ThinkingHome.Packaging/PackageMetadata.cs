using System.IO.Compression;
using System.Xml.Linq;
using NuGet.Versioning;

namespace ThinkingHome.Packaging;

public sealed record PackageMetadata(string Id, NuGetVersion Version, byte[] Nuspec, PluginManifest? Plugin)
{
    public static string NormalizeVersion(NuGetVersion version) => version.ToNormalizedString().Split('+')[0].ToLowerInvariant();

    public static PackageMetadata Read(byte[] bytes, bool requirePlugin)
    {
        using var input = new MemoryStream(bytes, writable: false);
        using var zip = new ZipArchive(input, ZipArchiveMode.Read);
        var paths = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        long total = 0;
        foreach (var entry in zip.Entries)
        {
            var path = entry.FullName.Replace('\\', '/');
            PluginManifest.Require(!Path.IsPathRooted(path) && !path.Contains(':') &&
                !path.Split('/').Any(x => x is "." or "..") && paths.Add(path), "Invalid or duplicate archive path: " + path);
            total = checked(total + entry.Length);
            PluginManifest.Require(total <= 256L * 1024 * 1024, "Package expanded size exceeds 256 MiB");
        }
        var specs = zip.Entries.Where(x => !x.FullName.Contains('/') && x.FullName.EndsWith(".nuspec", StringComparison.OrdinalIgnoreCase)).ToArray();
        PluginManifest.Require(specs.Length == 1, "Expected one root nuspec");
        byte[] ReadEntry(ZipArchiveEntry entry)
        {
            using var stream = entry.Open();
            using var buffer = new MemoryStream();
            stream.CopyTo(buffer);
            return buffer.ToArray();
        }
        var nuspec = ReadEntry(specs[0]);
        using var xml = new MemoryStream(nuspec);
        var metadata = XDocument.Load(xml).Root?.Elements().SingleOrDefault(x => x.Name.LocalName == "metadata")
            ?? throw new InvalidDataException("Missing nuspec metadata");
        string Field(string key) => metadata.Elements().Single(x => x.Name.LocalName == key).Value;
        var id = Field("id");
        PluginManifest.Require(System.Text.RegularExpressions.Regex.IsMatch(id, @"^[A-Za-z0-9_][A-Za-z0-9_.-]*$"), "Invalid package ID");
        var version = NuGetVersion.Parse(Field("version"));
        PluginManifest? plugin = null;
        if (requirePlugin)
        {
            foreach (var entry in zip.Entries.Where(x => x.FullName.StartsWith("lib/net10.0/", StringComparison.Ordinal)
                && x.FullName.Split('/').Length == 3 && x.FullName.EndsWith(".dll", StringComparison.OrdinalIgnoreCase)))
            {
                using var dll = new MemoryStream(ReadEntry(entry));
                var manifest = PluginManifest.TryRead(dll);
                if (manifest == null) continue;
                PluginManifest.Require(plugin == null, "Multiple plugin manifests");
                plugin = manifest;
                PluginManifest.Require(string.Equals(id, plugin.PackageId, StringComparison.OrdinalIgnoreCase) && version == plugin.Version,
                    "DLL and nuspec identity mismatch");
                var dependencies = metadata.Descendants().Where(x => x.Name.LocalName == "dependency")
                    .Select(x => x.Attribute("id")?.Value ?? "").ToHashSet(StringComparer.OrdinalIgnoreCase);
                PluginManifest.Require(plugin.Dependencies.Keys.All(dependencies.Contains), "Manifest dependency missing from nuspec");
            }
            PluginManifest.Require(plugin != null, "Package is not a ThinkingHome plugin");
        }
        return new(id, version, nuspec, plugin);
    }
}
