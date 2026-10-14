using System.IO.Compression;
using System.Xml.Linq;
using NuGet.Frameworks;
using NuGet.Versioning;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

/// <summary>
/// Зависимость NuGet: идентификатор пакета и допустимый диапазон версий.
/// </summary>
public sealed record PackageDependency(string Id, VersionRange Range);

/// <summary>
/// Управляемые сборки, ресурсы и нативные библиотеки, выбранные для целевой платформы.
/// </summary>
public sealed record SelectedAssets(string[] Managed, string[] Native);

/// <summary>
/// Выбирает совместимые зависимости и файлы пакетов для поддерживаемых платформ.
/// </summary>
public static class PackageAssets
{
    // Портативное замыкание SDK для двух целевых RID MVP, в порядке импорта.
    private static readonly Dictionary<string, string[]> Rids = new(StringComparer.Ordinal)
    {
        ["win-x64"] = ["win-x64", "win", "any", "base"],
        ["linux-x64"] = ["linux-x64", "linux", "unix-x64", "unix", "any", "base"]
    };

    /// <summary>
    /// Проверяет поддержку целевого фреймворка и идентификатора среды выполнения.
    /// </summary>
    public static void ValidateTarget(string framework, string rid)
    {
        if (framework != "net10.0" || !Rids.ContainsKey(rid))
        {
            throw new InvalidDataException("Supported targets: net10.0 / win-x64 or linux-x64");
        }
    }

    internal static bool IncludesRid(string target, string candidate) => Rids[target].Contains(candidate, StringComparer.Ordinal);

    /// <summary>
    /// Возвращает зависимости из ближайшей совместимой группы фреймворка в nuspec.
    /// </summary>
    public static PackageDependency[] Dependencies(PackageMetadata metadata, string framework)
    {
        using var input = new MemoryStream(metadata.Nuspec);
        var root = XDocument.Load(input).Descendants().SingleOrDefault(x => x.Name.LocalName == "dependencies");

        if (root == null)
        {
            return [];
        }

        var groups = root.Elements().Where(x => x.Name.LocalName == "group").ToArray();
        IEnumerable<XElement> selected = root.Elements();

        if (groups.Length > 0)
        {
            if (root.Elements().Any(x => x.Name.LocalName != "group"))
            {
                throw new InvalidDataException("Mixed grouped and ungrouped dependencies: " + metadata.Id);
            }

            var choices = groups.ToDictionary(x => ParseFramework(x.Attribute("targetFramework")?.Value ?? ""));
            var nearest = new FrameworkReducer().GetNearest(NuGetFramework.ParseFolder(framework), choices.Keys);
            selected = nearest == null ? [] : choices[nearest].Elements();
        }

        var result = selected.Where(x => x.Name.LocalName == "dependency").Select(x =>
        {
            var id = x.Attribute("id")?.Value ?? throw new InvalidDataException("Missing dependency ID");
            ValidateId(id);

            return new PackageDependency(id.ToLowerInvariant(), VersionRange.Parse(x.Attribute("version")?.Value ?? "*"));
        }).ToArray();

        if (result.Select(x => x.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != result.Length)
        {
            throw new InvalidDataException("Duplicate dependency: " + metadata.Id);
        }

        return result.OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();
    }

    /// <summary>
    /// Выбирает управляемые, ресурсные и нативные файлы с учётом фреймворка и цепочки RID.
    /// </summary>
    public static SelectedAssets Select(IEnumerable<string> paths, string framework, string rid)
    {
        ValidateTarget(framework, rid);
        var files = paths.Where(x => !x.EndsWith('/')).Order(StringComparer.Ordinal).ToArray();
        string[]? managed = null;

        foreach (var candidate in Rids[rid])
        {
            managed = SelectFramework(files, $"runtimes/{candidate}/lib/", framework);

            if (managed != null)
            {
                break;
            }
        }

        managed ??= SelectFramework(files, "lib/", framework);
        string[] native = [];

        foreach (var candidate in Rids[rid])
        {
            var prefix = $"runtimes/{candidate}/native/";
            var group = files.Where(x => x.StartsWith(prefix, StringComparison.Ordinal)).ToArray();

            if (group.Length == 0)
            {
                continue;
            }

            native = group.Where(x => Path.GetFileName(x) != "_._").ToArray();
            break;
        }

        if (managed == null && files.Any(x => x.StartsWith("ref/", StringComparison.Ordinal) || x.StartsWith("lib/",
            StringComparison.Ordinal) || (x.StartsWith("runtimes/", StringComparison.Ordinal) && x.Contains("/lib/"))))
        {
            throw new ResolutionException($"No compatible runtime assets for {framework}/{rid}; ref assemblies cannot execute");
        }

        if (native.Length == 0 && files.Any(x => x.StartsWith("runtimes/", StringComparison.Ordinal)
            && x.Contains("/native/")) && !Rids[rid].Any(candidate => files.Contains($"runtimes/{candidate}/native/_._")))
        {
            throw new ResolutionException("No compatible native assets for " + rid);
        }

        return new((managed ?? []).Where(x => x.EndsWith(".dll", StringComparison.OrdinalIgnoreCase)).ToArray(), native);
    }

    private static string[]? SelectFramework(string[] files, string prefix, string framework)
    {
        var groups = files.Where(x => x.StartsWith(prefix, StringComparison.Ordinal) && x[prefix.Length..].Contains('/'))
            .GroupBy(x => x[prefix.Length..].Split('/')[0]).ToArray();
        var frameworks = groups.Select(x => ParseFramework(x.Key)).ToArray();
        var nearest = new FrameworkReducer().GetNearest(NuGetFramework.ParseFolder(framework), frameworks);

        return nearest == null ? null : groups[Array.IndexOf(frameworks, nearest)].ToArray();
    }

    private static NuGetFramework ParseFramework(string value)
    {
        if (value.Length == 0)
        {
            return NuGetFramework.AnyFramework;
        }

        var result = NuGetFramework.Parse(value);

        if (result.IsUnsupported)
        {
            throw new InvalidDataException("Unsupported framework name: " + value);
        }

        return result;
    }

    internal static void ValidateId(string id)
    {
        if (!System.Text.RegularExpressions.Regex.IsMatch(id, @"^[A-Za-z0-9_][A-Za-z0-9_.-]*$"))
        {
            throw new InvalidDataException("Invalid package ID: " + id);
        }
    }

    internal static SortedDictionary<string, byte[]> ReadFiles(byte[] bytes)
    {
        // Общая проверка путей, дубликатов и размера до распаковки.
        PackageMetadata.Read(bytes, requirePlugin: false);
        using var input = new MemoryStream(bytes);
        using var archive = new ZipArchive(input);
        var result = new SortedDictionary<string, byte[]>(StringComparer.Ordinal);

        foreach (var entry in archive.Entries.Where(x => !x.FullName.EndsWith('/')))
        {
            if (entry.FullName.Contains('\\'))
            {
                throw new InvalidDataException("Package paths must use forward slashes");
            }

            using var stream = entry.Open();
            using var output = new MemoryStream();
            stream.CopyTo(output);
            result.Add(entry.FullName, output.ToArray());
        }

        return result;
    }
}
