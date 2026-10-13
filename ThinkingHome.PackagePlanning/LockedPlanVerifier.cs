using NuGet.Versioning;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

public static class LockedPlanVerifier {
    public static void CheckEnvelope(PlanRequest request, InstallationPlan plan, PlatformCatalog platform) {
        PackageAssets.ValidateTarget(request.Framework, request.Rid);
        if (plan.Lock.FormatVersion != 1 || plan.LoadMap.FormatVersion != 1)
            throw new InvalidDataException("Unsupported installation plan version");
        if (request.Framework != plan.Lock.Framework || request.Rid != plan.Lock.Rid || request.Framework != platform.Framework || request.Rid != platform.Rid ||
            plan.LoadMap.Framework != request.Framework || plan.LoadMap.Rid != request.Rid)
            throw new InvalidDataException("Locked target differs from declaration or platform");
        var roots = request.Plugins.Select(x => { PackageAssets.ValidateId(x.Id); return new RootPlugin(x.Id.ToLowerInvariant(), VersionRange.Parse(x.Version).ToString()); })
            .OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();
        if (roots.Select(x => x.Id).Distinct().Count() != roots.Length || !roots.SequenceEqual(plan.Lock.Roots))
            throw new InvalidDataException("Root declaration differs from lock file");
        if (plan.LoadMap.LockSha512 != PlanJson.Hash(PlanJson.Bytes(plan.Lock))) throw new InvalidDataException("Load map is not bound to this lock file");
        foreach (var package in plan.Lock.Packages) {
            PackageAssets.ValidateId(package.Id);
            if (package.Kind is not ("plugin" or "library") || package.Key != package.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(NuGetVersion.Parse(package.Version)))
                throw new InvalidDataException("Invalid locked package identity: " + package.Key);
            if (!Uri.TryCreate(package.Source, UriKind.Absolute, out var uri) || uri.Scheme is not ("https" or "http") || uri.UserInfo.Length != 0 || uri.Fragment.Length != 0)
                throw new InvalidDataException("Invalid locked source: " + package.Key);
        }
    }

    // Разворачиваем ровно записанные узлы. Поиска новых версий и обращений к источникам здесь нет.
    public static void Verify(PlanRequest request, InstallationPlan plan, PlatformCatalog platform,
        IReadOnlyDictionary<string, byte[]> archives, CancellationToken cancellation = default) {
        CheckEnvelope(request, plan, platform);
        var candidates = new Dictionary<string, Candidate>(StringComparer.Ordinal);
        foreach (var package in plan.Lock.Packages) {
            cancellation.ThrowIfCancellationRequested();
            if (!archives.TryGetValue(package.Key, out var bytes) || PlanJson.Hash(bytes) != package.Sha512)
                throw new InvalidDataException("Package hash mismatch: " + package.Key);
            var metadata = PackageMetadata.Read(bytes, package.Kind == "plugin");
            if (!string.Equals(metadata.Id, package.Id, StringComparison.OrdinalIgnoreCase) || metadata.Version != NuGetVersion.Parse(package.Version))
                throw new InvalidDataException("Locked package identity mismatch: " + package.Key);
            var dependencies = PackageAssets.Dependencies(metadata, request.Framework);
            if (metadata.Plugin != null && metadata.Plugin.Dependencies.Keys.Any(id => !dependencies.Any(x => string.Equals(x.Id, id, StringComparison.OrdinalIgnoreCase))))
                throw new InvalidDataException("Manifest dependency absent from selected framework group: " + package.Key);
            candidates.Add(package.Key, new(new(new Uri(package.Source), metadata, bytes, package.Sha512), dependencies));
        }
        var assignments = plan.Lock.Nodes.ToDictionary(x => x.Key, x => candidates[x.Package], StringComparer.Ordinal);
        foreach (var (key, candidate) in assignments) {
            var isPlugin = !key.Contains('/') && key.StartsWith("plugin:", StringComparison.Ordinal);
            var id = candidate.Download.Metadata.Id.ToLowerInvariant();
            if (isPlugin != (candidate.Download.Metadata.Plugin != null) || (isPlugin ? key != "plugin:" + id : key != PackagePlanner.Scope(key) + "/" + id))
                throw new InvalidDataException("Invalid locked node: " + key);
        }
        var roots = plan.Lock.Roots.Select(x => new Requirement("root", "plugin:" + x.Id, x.Id, VersionRange.Parse(x.Version), "plugin", x.Id)).ToArray();
        var provided = platform.Packages.ToDictionary(x => x.Key.ToLowerInvariant(), x => NuGetVersion.Parse(x.Value), StringComparer.Ordinal);
        var graph = PackagePlanner.ExpandGraph(roots, platform, provided, assignments);
        if (graph.Edges.Any(x => x.Kind != "platform" && !graph.Nodes.ContainsKey(x.Key))) throw new InvalidDataException("Locked dependency is missing");
        var verified = PlanBuilder.Build(request, platform, graph, cancellation);
        if (!PlanJson.Bytes(verified.Lock).SequenceEqual(PlanJson.Bytes(plan.Lock)) || !PlanJson.Bytes(verified.LoadMap).SequenceEqual(PlanJson.Bytes(plan.LoadMap)))
            throw new InvalidDataException("Locked graph, files, platform or load map differ from verified package contents");
    }
}
