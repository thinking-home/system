using ThinkingHome.Platform;
using NuGet.Versioning;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

/// <summary>
/// Проверяет воспроизводимость сохранённого плана относительно платформы и содержимого пакетов.
/// </summary>
public static class LockedPlanVerifier
{
    /// <summary>
    /// Проверяет формат документов, цель, корневые запросы и привязку карты загрузки к lock-файлу.
    /// </summary>
    public static void CheckEnvelope(PlanRequest request, InstallationPlan plan, PlatformCatalog platform)
    {
        PackageAssets.ValidateTarget(request.Framework, request.Rid);

        if (plan.Lock.FormatVersion != 1 || plan.LoadMap.FormatVersion != 1)
        {
            throw new InvalidDataException("Unsupported installation plan version");
        }

        if (request.Framework != plan.Lock.Framework || request.Rid != plan.Lock.Rid
            || request.Framework != platform.Framework || request.Rid != platform.Rid
            || plan.LoadMap.Framework != request.Framework || plan.LoadMap.Rid != request.Rid)
        {
            throw new InvalidDataException("Locked target differs from declaration or platform");
        }

        var roots = request.Plugins.Select(x =>
        {
            PackageAssets.ValidateId(x.Id);

            return new RootPlugin(x.Id.ToLowerInvariant(), VersionRange.Parse(x.Version).ToString());
        }).OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();

        if (roots.Select(x => x.Id).Distinct().Count() != roots.Length || !roots.SequenceEqual(plan.Lock.Roots))
        {
            throw new InvalidDataException("Root declaration differs from lock file");
        }

        if (plan.LoadMap.LockSha512 != PlanJson.Hash(PlanJson.Bytes(plan.Lock)))
        {
            throw new InvalidDataException("Load map is not bound to this lock file");
        }

        foreach (var package in plan.Lock.Packages)
        {
            PackageAssets.ValidateId(package.Id);

            if (package.Kind is not ("plugin" or "library")
                || package.Key != package.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(NuGetVersion.Parse(package.Version)))
            {
                throw new InvalidDataException("Invalid locked package identity: " + package.Key);
            }

            if (!Uri.TryCreate(package.Source, UriKind.Absolute, out var uri) || uri.Scheme is not ("https" or "http")
                || uri.UserInfo.Length != 0 || uri.Fragment.Length != 0)
            {
                throw new InvalidDataException("Invalid locked source: " + package.Key);
            }
        }
    }

    // Разворачиваем ровно записанные узлы. Поиска новых версий и обращений к источникам здесь нет.
    /// <summary>
    /// Восстанавливает граф из указанных архивов и сравнивает его с планом без поиска новых версий.
    /// </summary>
    public static void Verify(PlanRequest request, InstallationPlan plan, PlatformCatalog platform,
        IReadOnlyDictionary<string, byte[]> archives, CancellationToken cancellation = default)
    {
        CheckEnvelope(request, plan, platform);
        var verified = Rebuild(request, plan, platform, archives, cancellation);

        if (!PlanJson.Bytes(verified.Lock).SequenceEqual(PlanJson.Bytes(plan.Lock)) || !PlanJson.Bytes(verified.LoadMap)
            .SequenceEqual(PlanJson.Bytes(plan.LoadMap)))
        {
            throw new InvalidDataException("Locked graph, files, platform or load map differ from verified package contents");
        }
    }

    /// <summary>
    /// Исключает неиспользуемый плагин и недостижимые зависимости без изменения оставшихся версий и источников.
    /// </summary>
    public static InstallationPlan RemovePlugin(string id, PlanRequest request, InstallationPlan plan,
        PlatformCatalog platform, IReadOnlyDictionary<string, byte[]> archives, CancellationToken cancellation = default)
    {
        PackageAssets.ValidateId(id);
        Verify(request, plan, platform, archives, cancellation);
        var key = "plugin:" + id.ToLowerInvariant();
        if (!plan.Lock.PluginOrder.Contains(key))
            throw new InvalidOperationException("Plugin is not installed: " + id);

        // Обратный обход проходит и через библиотеки: зависимость от плагина бывает транзитивной.
        var ancestors = new HashSet<string>(StringComparer.Ordinal);
        var pending = new Queue<string>([key]);
        while (pending.TryDequeue(out var node))
        {
            cancellation.ThrowIfCancellationRequested();
            foreach (var edge in plan.Lock.Dependencies.Where(x => x.To == node && x.From != "root"))
                if (ancestors.Add(edge.From)) pending.Enqueue(edge.From);
        }

        var consumers = plan.Lock.PluginOrder.Where(ancestors.Contains).ToArray();
        if (consumers.Length > 0)
            throw new InvalidOperationException($"Plugin {id} is required by: " + string.Join(", ", consumers));

        var remaining = request with { Plugins = request.Plugins.Where(x => !x.Id.Equals(id, StringComparison.OrdinalIgnoreCase)).ToArray() };
        var reachable = new HashSet<string>(StringComparer.Ordinal);
        pending = new Queue<string>(remaining.Plugins.Select(x => "plugin:" + x.Id.ToLowerInvariant()));

        // Удаляем также декларации shared ушедших плагинов до повторного построения карты.
        while (pending.TryDequeue(out var node))
        {
            cancellation.ThrowIfCancellationRequested();
            if (!reachable.Add(node)) continue;
            foreach (var edge in plan.Lock.Dependencies.Where(x => x.From == node && x.Kind != "platform"))
                pending.Enqueue(edge.To);
        }

        var nodes = plan.Lock.Nodes.Where(x => reachable.Contains(x.Key)).ToArray();
        var packages = nodes.Select(x => x.Package).ToHashSet(StringComparer.Ordinal);
        var subset = plan with
        {
            Lock = plan.Lock with
            {
                Nodes = nodes,
                Packages = plan.Lock.Packages.Where(x => packages.Contains(x.Key)).ToArray()
            }
        };

        return Rebuild(remaining, subset, platform, archives, cancellation);
    }

    private static InstallationPlan Rebuild(PlanRequest request, InstallationPlan plan, PlatformCatalog platform,
        IReadOnlyDictionary<string, byte[]> archives, CancellationToken cancellation)
    {
        var candidates = new Dictionary<string, Candidate>(StringComparer.Ordinal);

        foreach (var package in plan.Lock.Packages)
        {
            cancellation.ThrowIfCancellationRequested();

            if (!archives.TryGetValue(package.Key, out var bytes) || PlanJson.Hash(bytes) != package.Sha512)
            {
                throw new InvalidDataException("Package hash mismatch: " + package.Key);
            }

            var metadata = PackageMetadata.Read(bytes, package.Kind == "plugin");

            if (!string.Equals(metadata.Id, package.Id, StringComparison.OrdinalIgnoreCase)
                || metadata.Version != NuGetVersion.Parse(package.Version))
            {
                throw new InvalidDataException("Locked package identity mismatch: " + package.Key);
            }

            var dependencies = PackageAssets.Dependencies(metadata, request.Framework);

            if (metadata.Plugin != null && metadata.Plugin.Dependencies.Keys.Any(id => !dependencies.Any(x =>
                string.Equals(x.Id, id, StringComparison.OrdinalIgnoreCase))))
            {
                throw new InvalidDataException("Manifest dependency absent from selected framework group: " + package.Key);
            }

            candidates.Add(package.Key, new(new(new Uri(package.Source), metadata, bytes, package.Sha512), dependencies));
        }

        var assignments = plan.Lock.Nodes.ToDictionary(x => x.Key, x => candidates[x.Package], StringComparer.Ordinal);

        foreach (var (key, candidate) in assignments)
        {
            var isPlugin = !key.Contains('/') && key.StartsWith("plugin:", StringComparison.Ordinal);
            var id = candidate.Metadata.Id.ToLowerInvariant();

            if (isPlugin != (candidate.Metadata.Plugin != null) || (isPlugin ? key != "plugin:" + id
                : key != PackagePlanner.Scope(key) + "/" + id))
            {
                throw new InvalidDataException("Invalid locked node: " + key);
            }
        }

        var roots = request.Plugins.Select(x => new Requirement("root", "plugin:" + x.Id.ToLowerInvariant(), x.Id.ToLowerInvariant(),
            VersionRange.Parse(x.Version), "plugin", x.Id)).ToArray();
        var provided = platform.Packages.ToDictionary(x => x.Key.ToLowerInvariant(), x => NuGetVersion.Parse(x.Value),
            StringComparer.Ordinal);
        var graph = PackagePlanner.ExpandGraph(roots, provided, assignments);

        if (graph.Edges.Any(x => x.Kind != "platform" && !graph.Nodes.ContainsKey(x.Key)))
        {
            throw new InvalidDataException("Locked dependency is missing");
        }

        return PlanBuilder.Build(request, platform, graph, cancellation);
    }
}
