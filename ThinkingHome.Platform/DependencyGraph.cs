using System.Runtime.CompilerServices;
using System.Text.Json;

[assembly: InternalsVisibleTo("ThinkingHome.Packaging.Tests")]

namespace ThinkingHome.Platform;

internal sealed record PlatformDependency(string Id, string Version, string[] Assemblies);

/// <summary>Обходит только зависимости ядра в стандартном графе deps.json.</summary>
internal static class DependencyGraph
{
    internal static HashSet<string> FrameworkAssemblies(string directory)
    {
        var files = RuntimeFiles.DependencyFiles().Where(path => Path.GetDirectoryName(path) == directory).ToArray();
        if (files.Length == 0)
        {
            throw new NotSupportedException("Shared framework deps.json is unavailable: " + directory);
        }

        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var file in files)
        {
            using var document = JsonDocument.Parse(File.ReadAllBytes(file));
            foreach (var library in Target(document).EnumerateObject())
            {
                if (!library.Value.TryGetProperty("runtime", out var runtime)) continue;
                foreach (var asset in runtime.EnumerateObject())
                {
                    if (asset.Name.EndsWith(".dll", StringComparison.OrdinalIgnoreCase))
                        names.Add(Path.GetFileNameWithoutExtension(asset.Name));
                }
            }
        }

        return names;
    }

    internal static PlatformDependency[] Read(IEnumerable<string> files, string root, IEnumerable<string> frameworkAssemblies,
        IEnumerable<string> availableAssemblies)
    {
        var provided = frameworkAssemblies.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var available = availableAssemblies.ToHashSet(StringComparer.OrdinalIgnoreCase);
        foreach (var file in files)
        {
            using var document = JsonDocument.Parse(File.ReadAllBytes(file));
            var target = Target(document);
            var libraries = target.EnumerateObject().ToDictionary(x => x.Name[..x.Name.LastIndexOf('/')],
                StringComparer.OrdinalIgnoreCase);

            if (!libraries.ContainsKey(root))
            {
                continue;
            }

            var result = new Dictionary<string, PlatformDependency>(StringComparer.OrdinalIgnoreCase);
            Visit(root);
            return result.Values.OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();

            void Visit(string id)
            {
                if (result.ContainsKey(id)) return;
                if (!libraries.TryGetValue(id, out var library))
                {
                    if (provided.Contains(id)) return;
                    throw new InvalidDataException("Platform dependency is missing from deps.json: " + id);
                }

                var assets = library.Value.TryGetProperty("runtime", out var runtime)
                    ? runtime.EnumerateObject().Select(x => x.Name).Where(x => x.EndsWith(".dll", StringComparison.OrdinalIgnoreCase)).ToArray()
                    : [];
                if (library.Value.TryGetProperty("runtimeTargets", out var runtimeTargets)
                    && runtimeTargets.ValueKind == JsonValueKind.Object)
                {
                    // Фактический вариант каждого имени уже выбран хостом .NET в списке сборок процесса.
                    assets = assets.Concat(runtimeTargets.EnumerateObject()
                        .Where(x => x.Value.GetProperty("assetType").GetString() == "runtime")
                        .Select(x => x.Name).Where(x => available.Contains(Path.GetFileNameWithoutExtension(x))))
                        .Distinct(StringComparer.Ordinal).ToArray();
                }

                result.Add(id, new(id, library.Name[(library.Name.LastIndexOf('/') + 1)..], assets));

                if (library.Value.TryGetProperty("dependencies", out var dependencies))
                {
                    foreach (var dependency in dependencies.EnumerateObject()) Visit(dependency.Name);
                }
            }
        }

        throw new InvalidDataException("Core dependency graph was not found in process deps.json: " + root);
    }

    private static JsonElement Target(JsonDocument document)
    {
        var name = document.RootElement.GetProperty("runtimeTarget").GetProperty("name").GetString()!;
        return document.RootElement.GetProperty("targets").GetProperty(name);
    }
}
