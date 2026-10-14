using System.IO.Compression;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
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
                using var pe = new PEReader(dll);
                if (!pe.HasMetadata) continue;
                var reader = pe.GetMetadataReader();
                if (!reader.IsAssembly) continue;
                var fields = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                foreach (var handle in reader.GetAssemblyDefinition().GetCustomAttributes())
                {
                    var attribute = reader.GetCustomAttribute(handle);
                    if (attribute.Constructor.Kind != HandleKind.MemberReference) continue;
                    var constructor = reader.GetMemberReference((MemberReferenceHandle)attribute.Constructor);
                    if (constructor.Parent.Kind != HandleKind.TypeReference) continue;
                    var type = reader.GetTypeReference((TypeReferenceHandle)constructor.Parent);
                    if (reader.GetString(type.Namespace) != "System.Reflection" || reader.GetString(type.Name) != "AssemblyMetadataAttribute") continue;
                    var blob = reader.GetBlobReader(attribute.Value);
                    PluginManifest.Require(blob.ReadUInt16() == 1, "Invalid attribute encoding");
                    var key = blob.ReadSerializedString();
                    var value = blob.ReadSerializedString();
                    if (key?.StartsWith(PluginManifest.Prefix, StringComparison.Ordinal) != true) continue;
                    PluginManifest.Require(blob.ReadUInt16() == 0 && blob.RemainingBytes == 0, "Unexpected plugin attribute payload");
                    PluginManifest.Require(!string.IsNullOrWhiteSpace(value), "Empty plugin metadata: " + key);
                    PluginManifest.Require(fields.TryAdd(key[PluginManifest.Prefix.Length..], value!), "Duplicate plugin metadata: " + key);
                }
                if (fields.Count == 0) continue;
                PluginManifest.Require(plugin == null, "Multiple plugin manifests");
                plugin = PluginManifest.FromFields(fields);
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
