using System.IO.Compression;
using System.Reflection;
using System.Text.Json;
using System.Xml.Linq;
using NuGet.Versioning;
using ThinkingHome.Platform;
using static ThinkingHome.Packaging.PluginManifest;

namespace ThinkingHome.Packaging;

/// <summary>
/// Идентификатор, версия и точки входа успешно проверенного пакета плагина.
/// </summary>
public sealed record ValidationResult(string PackageId, string Version, string[] EntryPoints);

/// <summary>
/// Проверяет структуру пакета, манифест DLL и статические контракты его зависимостей.
/// </summary>
public static class PackageValidator
{
    /// <summary>
    /// Проверяет пакет с использованием сборок зависимостей из указанного каталога входных файлов.
    /// </summary>
    public static ValidationResult Validate(string packagePath, string inputsDirectory)
    {
        var temporary = Path.Combine(Path.GetTempPath(), "thinkinghome-validation-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(temporary);

        try
        {
            return ValidateExtracted(packagePath, inputsDirectory, temporary);
        }
        finally
        {
            Directory.Delete(temporary, recursive: true);
        }
    }

    private static ValidationResult ValidateExtracted(string packagePath, string inputs, string temporary)
    {
        using var zip = ZipFile.OpenRead(packagePath);
        var names = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var entry in zip.Entries)
        {
            var name = entry.FullName.Replace('\\', '/');
            Require(!Path.IsPathRooted(name) && !name.Contains(':') && !name.Split('/').Any(x => x is ".." or "."),
                $"Unsafe package path: {name}");
            Require(names.Add(name), $"Duplicate package path: {name}");
        }

        var spec = zip.Entries.SingleOrDefault(x => !x.FullName.Contains('/')
            && x.FullName.EndsWith(".nuspec")) ?? throw new InvalidDataException("Expected one root nuspec");
        using var specStream = spec.Open();
        var document = XDocument.Load(specStream);
        var metadata = document.Root?.Elements().SingleOrDefault(x =>
            x.Name.LocalName == "metadata") ?? throw new InvalidDataException("Missing nuspec metadata");

        string Field(string key) => metadata.Elements().SingleOrDefault(x =>
            x.Name.LocalName == key)?.Value ?? throw new InvalidDataException($"Missing nuspec {key}");

        var framework = File.ReadAllText(Path.Combine(inputs, "framework.txt")).Trim();
        Require(framework == "net10.0", "Packaging v1 supports net10.0 only");
        var allDllEntries = zip.Entries.Where(x => x.FullName.EndsWith(".dll", StringComparison.OrdinalIgnoreCase)).ToArray();

        foreach (var entry in allDllEntries.Where(x => x.FullName.StartsWith("runtimes/", StringComparison.Ordinal)))
        {
            var parts = entry.FullName.Split('/');
            Require(parts.Length >= 4 && (parts[2] == "native" || (parts.Length >= 5 && parts[2] == "lib"
                && parts[3] == framework)), $"Unsupported runtime DLL asset location: {entry.FullName}");
        }

        // При упаковке проверяем базовый контракт; конкретные RID-варианты повторно проверяет планировщик.
        var dllEntries = allDllEntries.Where(x => !x.FullName.StartsWith("runtimes/", StringComparison.Ordinal)).ToArray();
        Require(dllEntries.Length > 0, "No plugin DLL");
        var files = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var entry in dllEntries)
        {
            Require(entry.FullName.StartsWith($"lib/{framework}/", StringComparison.Ordinal),
                $"Unsupported DLL asset location: {entry.FullName}");
            var path = Path.Combine(temporary, entry.FullName.Replace('/', Path.DirectorySeparatorChar));
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            entry.ExtractToFile(path);
            var name = AssemblyName.GetAssemblyName(path).Name!;

            if (name.EndsWith(".resources", StringComparison.Ordinal))
            {
                continue;
            }

            Require(files.TryAdd(name, path), $"Duplicate assembly name in package: {name}");
        }

        var referenceFiles = File.ReadAllLines(Path.Combine(inputs, "references.txt")).Where(x =>
            !string.IsNullOrWhiteSpace(x)).Select(Path.GetFullPath).ToArray();
        var runtimeDirectory = Path.GetDirectoryName(typeof(object).Assembly.Location);
        var runtimeFiles = RuntimeFiles.Assemblies().Where(x =>
            Path.GetDirectoryName(x) == runtimeDirectory).ToArray();
        var resolverFiles = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var path in files.Values.Concat(referenceFiles).Concat(runtimeFiles))
        {
            var name = AssemblyName.GetAssemblyName(path).Name!;
            resolverFiles.TryAdd(name, path);
        }

        using var context = new MetadataLoadContext(new PathAssemblyResolver(resolverFiles.Values));
        var assemblies = files.Values.Select(context.LoadFromAssemblyPath).ToArray();

        bool HasManifest(Assembly assembly) => assembly.GetCustomAttributesData().Any(x =>
            x.AttributeType.FullName == typeof(AssemblyMetadataAttribute).FullName && x.ConstructorArguments.Count == 2
            && x.ConstructorArguments[0].Value is string key && key.StartsWith(Prefix, StringComparison.Ordinal));

        var candidates = assemblies.Where(HasManifest).ToArray();
        Require(candidates.Length == 1, "Expected exactly one plugin manifest DLL");
        var main = candidates.Single();
        var manifest = Read(main);
        Require(string.Equals(manifest.PackageId, Field("id"), StringComparison.OrdinalIgnoreCase),
            "Package ID mismatch between DLL and nuspec");
        Require(NuGetVersion.TryParse(Field("version"), out var version) && version == manifest.Version,
            "Package version mismatch between DLL and nuspec");

        var platform = HostPlatform.Current().Packages.Keys.ToHashSet(StringComparer.OrdinalIgnoreCase);
        using var resolvedAssets = JsonDocument.Parse(File.ReadAllText(File.ReadAllText(Path.Combine(inputs, "assets.txt")).Trim()));
        var resolvedVersions = resolvedAssets.RootElement.GetProperty("targets").GetProperty(framework).EnumerateObject()
            .ToDictionary(x => x.Name[..x.Name.LastIndexOf('/')], x =>
            NuGetVersion.Parse(x.Name[(x.Name.LastIndexOf('/') + 1)..]), StringComparer.OrdinalIgnoreCase);
        var dependencies = metadata.Descendants().Where(x => x.Name.LocalName == "dependency").ToArray();
        var groups = metadata.Elements().Where(x => x.Name.LocalName == "dependencies").SelectMany(x => x.Elements()
            .Where(child => child.Name.LocalName == "group")).ToArray();
        Require(groups.Length <= 1 && groups.All(x => x.Attribute("targetFramework")?.Value == framework),
            "Expected a single net10.0 dependency group");

        var dependencyIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var dependency in dependencies)
        {
            var id = dependency.Attribute("id")?.Value ?? "";
            Require(dependencyIds.Add(id), $"Duplicate nuspec dependency: {id}");
            Require(VersionRange.TryParse(dependency.Attribute("version")?.Value ?? "", out var range),
                $"Invalid dependency version: {id}");
            Require(resolvedVersions.TryGetValue(id, out var resolvedVersion) && range!.Satisfies(resolvedVersion),
                $"Resolved dependency does not satisfy nuspec: {id}");
        }

        foreach (var id in manifest.Dependencies.Keys)
        {
            Require(dependencyIds.Contains(id), $"Manifest dependency missing from nuspec: {id}");
            Require(!platform.Contains(id), $"Platform dependency must not be reclassified: {id}");
        }

        var policies = ReadPolicies(inputs, framework, manifest, platform);

        // Отсутствие явной категории private не должно скрывать потерянную зависимость в nuspec.
        var graph = resolvedAssets.RootElement.GetProperty("targets").GetProperty(framework).EnumerateObject()
            .ToDictionary(x => x.Name[..x.Name.LastIndexOf('/')], x => x.Value, StringComparer.OrdinalIgnoreCase);
        var reachable = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var pending = new Queue<string>(dependencyIds);
        while (pending.TryDequeue(out var id))
        {
            if (!reachable.Add(id) || !graph.TryGetValue(id, out var node)
                || !node.TryGetProperty("dependencies", out var children)) continue;
            foreach (var child in children.EnumerateObject()) pending.Enqueue(child.Name);
        }

        foreach (var path in runtimeFiles)
        {
            policies.TryAdd(AssemblyName.GetAssemblyName(path).Name!, new("platform", ".NET"));
        }

        Require(!policies.ContainsKey(main.GetName().Name!), "Plugin assembly name collides with platform or dependency");
        policies[main.GetName().Name!] = new("plugin", manifest.PackageId);

        foreach (var assembly in assemblies.Where(x => x != main))
        {
            var name = assembly.GetName().Name!;
            Require(manifest.Embedded.TryGetValue(name, out var kind), $"Undeclared bundled assembly: {name}");
            Require(!policies.ContainsKey(name), $"Bundled assembly duplicates platform or package dependency: {name}");
            policies[name] = new(kind!, manifest.PackageId + "/" + name);
        }

        foreach (var name in manifest.Embedded.Keys)
        {
            Require(files.ContainsKey(name) && name != main.GetName().Name, $"Missing embedded assembly: {name}");
        }

        foreach (var entry in dllEntries.Where(x => x.FullName.EndsWith(".resources.dll", StringComparison.OrdinalIgnoreCase)))
        {
            var owner = Path.GetFileName(entry.FullName)[..^".resources.dll".Length];
            Require(files.ContainsKey(owner), $"Satellite resource has no packaged owner: {entry.FullName}");
        }

        // Все внешние ссылки обязаны быть разрешимы. Приватные реализации не обходятся как API.
        foreach (var assembly in assemblies)
        {
            foreach (var reference in assembly.GetReferencedAssemblies())
            {
                var resolved = context.LoadFromAssemblyName(reference);
                Require(policies.ContainsKey(resolved.GetName().Name!), $"Unclassified assembly reference: {reference}");
                var policy = policies[resolved.GetName().Name!];
                Require(policy.Kind == "platform" || files.ContainsKey(resolved.GetName().Name!) || reachable.Contains(policy.Owner),
                    $"Assembly dependency missing from nuspec graph: {policy.Owner}");
            }
        }

        var entries = PluginEntryPoints.Discover(main);
        var errors = new ContractValidator(policies).Validate(main);
        Require(errors.Count == 0, string.Join(Environment.NewLine, errors));

        return new(manifest.PackageId, manifest.Version.ToNormalizedString(), entries);
    }

    private static Dictionary<string, AssemblyPolicy> ReadPolicies(string inputs, string framework, PluginManifest manifest,
        HashSet<string> platform)
    {
        var assetsPath = File.ReadAllText(Path.Combine(inputs, "assets.txt")).Trim();
        using var assets = JsonDocument.Parse(File.ReadAllText(assetsPath));
        var target = assets.RootElement.GetProperty("targets").GetProperty(framework);
        var projectDirectory = Path.GetDirectoryName(assets.RootElement.GetProperty("project").GetProperty("restore")
            .GetProperty("projectPath").GetString()!)!;
        var projectIds = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        foreach (var library in assets.RootElement.GetProperty("libraries").EnumerateObject())
        {
            if (library.Value.GetProperty("type").GetString() != "project")
            {
                continue;
            }

            projectIds[Path.GetFullPath(library.Value.GetProperty("path").GetString()!,
                projectDirectory)] = library.Name[..library.Name.LastIndexOf('/')];
        }

        var result = new Dictionary<string, AssemblyPolicy>(StringComparer.OrdinalIgnoreCase);
        var packageIds = target.EnumerateObject().Select(x => x.Name[..x.Name.LastIndexOf('/')])
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var line in File.ReadAllLines(Path.Combine(inputs, "ownership.txt")))
        {
            var parts = line.Split('|');
            Require(parts.Length == 4, "Invalid assembly ownership record");
            var name = AssemblyName.GetAssemblyName(parts[0]).Name!;
            var id = parts[1];

            if (parts[2].Length > 0)
            {
                Require(projectIds.TryGetValue(Path.GetFullPath(parts[2]), out var projectId),
                    $"Project reference not in assets: {parts[2]}");
                id = projectId!;
            }

            // Обычные Reference не являются пакетами: встроенные сборки проверяются отдельно.
            if (id.Length == 0 && parts[3].Length == 0)
            {
                continue;
            }

            Require(parts[3].Length > 0 || packageIds.Contains(id), $"Package reference not in assets: {id}");
            var kind = parts[3].Length > 0 || platform.Contains(id) ? "platform" : manifest.Dependencies.GetValueOrDefault(id, "private");
            if (kind != "platform")
            {
                var plugin = TryRead(Path.GetFullPath(parts[0]));
                if (plugin != null)
                {
                    Require(string.Equals(plugin.PackageId, id, StringComparison.OrdinalIgnoreCase),
                        $"Plugin dependency identity differs from reference: {id}");
                    Require(kind != "shared", $"Plugin cannot be marked shared: {id}");
                    kind = "plugin";
                }
            }
            var policy = new AssemblyPolicy(kind, id);
            Require(!result.TryGetValue(name, out var existing) || existing == policy, $"Ambiguous assembly ownership: {name}");
            result[name] = policy;
        }

        return result;
    }
}
