using ThinkingHome.Platform;
using NuGet.Versioning;
using ThinkingHome.PackageSources;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

internal sealed record Candidate(PackageMetadata Metadata, Uri Source, string Sha512, PackageDependency[] Dependencies,
    byte[]? Archive, IReadOnlyDictionary<string, string>? LocalFiles = null)
{
    public Candidate(PackageDownload download, PackageDependency[] dependencies) : this(download.Metadata, download.Source,
        download.Sha512, dependencies, download.Bytes)
    {
    }

    public SortedDictionary<string, byte[]> ReadFiles() => LocalFiles == null ? PackageAssets.ReadFiles(Archive!)
        : new(LocalFiles.ToDictionary(x => x.Key, x => File.ReadAllBytes(x.Value)), StringComparer.Ordinal);
}

internal sealed record Requirement(string From, string Key, string Id, VersionRange Range, string Kind, string Chain);

internal sealed record ResolvedGraph(Dictionary<string, Candidate> Nodes, Requirement[] Edges, string[] PluginOrder);

/// <summary>
/// Подбирает совместимые версии пакетов из источника и строит проверенный план установки.
/// </summary>
public sealed class PackagePlanner(IPackageSource source)
{
    /// <summary>
    /// Разрешает зависимости корневых плагинов с учётом платформы, изоляции и общих контрактов.
    /// </summary>
    public async Task<InstallationPlan> PlanAsync(PlanRequest request, PlatformCatalog platform, CancellationToken cancellation = default)
    {
        PackageAssets.ValidateTarget(request.Framework, request.Rid);

        if (platform.Framework != request.Framework || platform.Rid != request.Rid)
        {
            throw new InvalidDataException("Platform catalog target differs from requested target");
        }

        NuGetVersion.Parse(platform.Version);
        var platformPackages = platform.Packages.ToDictionary(x => x.Key.ToLowerInvariant(), x =>
            NuGetVersion.Parse(x.Value), StringComparer.Ordinal);

        if (request.Plugins.Length == 0)
        {
            throw new InvalidDataException("At least one root plugin is required");
        }

        var roots = request.Plugins.Select(x =>
        {
            PackageAssets.ValidateId(x.Id);

            if (platformPackages.ContainsKey(x.Id.ToLowerInvariant()))
            {
                throw new InvalidDataException("Platform package cannot be a root plugin: " + x.Id);
            }

            return new Requirement("root", "plugin:" + x.Id.ToLowerInvariant(), x.Id.ToLowerInvariant(),
                VersionRange.Parse(x.Version), "plugin", x.Id);
        }).OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();

        if (roots.Select(x => x.Id).Distinct().Count() != roots.Length)
        {
            throw new InvalidDataException("Duplicate root plugin");
        }

        var listings = new Dictionary<string, PackageListing>(StringComparer.Ordinal);
        var downloads = new Dictionary<string, Candidate>(StringComparer.Ordinal);
        var steps = 0;
        string diagnostic = "No solution";

        ResolvedGraph Expand(Dictionary<string, Candidate> assignments) => ExpandGraph(roots, platformPackages, assignments);

        async Task<InstallationPlan?> Search(Dictionary<string, Candidate> assignments)
        {
            cancellation.ThrowIfCancellationRequested();

            if (++steps > 10000)
            {
                throw new ResolutionException("Dependency search exceeded 10000 branches; narrow root version ranges");
            }

            ResolvedGraph graph;

            try
            {
                graph = Expand(assignments);
            }
            catch (ResolutionException ex)
            {
                diagnostic = ex.Message;

                return null;
            }

            var unresolved = graph.Edges.Where(x => x.Kind != "platform" && !graph.Nodes.ContainsKey(x.Key)).GroupBy(x =>
                x.Key).OrderBy(x => x.Key.StartsWith("plugin:", StringComparison.Ordinal) ? 0 : 1).ThenBy(x => x.Key,
                StringComparer.Ordinal).FirstOrDefault();

            if (unresolved == null)
            {
                try
                {
                    return PlanBuilder.Build(request, platform, graph, cancellation);
                }
                catch (ResolutionException ex)
                {
                    diagnostic = ex.Message;

                    return null;
                }
            }

            var needed = unresolved.First();
            var kind = needed.Kind == "plugin" ? PackageKind.Plugin : PackageKind.Library;
            var listingKey = kind + ":" + needed.Id;

            if (!listings.TryGetValue(listingKey, out var listing))
            {
                try
                {
                    listing = await source.FindAsync(kind, needed.Id, cancellation);
                }
                catch (KeyNotFoundException)
                {
                    diagnostic = "Missing package: " + needed.Chain;

                    return null;
                }

                listings.Add(listingKey, listing);
            }

            var allowPrerelease = unresolved.Any(x => x.Range.MinVersion?.IsPrerelease == true
                || x.Range.MaxVersion?.IsPrerelease == true || x.Range.Float?.IncludePrerelease == true);
            var versions = listing.Versions.Where(x => (!x.IsPrerelease || allowPrerelease) && unresolved.All(r =>
                Matches(r.Range, x))).Distinct().OrderDescending().ToArray();

            if (versions.Length == 0)
            {
                diagnostic = "No compatible version for " + needed.Key + ": " + string.Join("; ", unresolved.Select(x =>
                    x.Chain + " requires " + x.Range));
            }

            foreach (var version in versions)
            {
                var downloadKey = listingKey + "/" + PackageMetadata.NormalizeVersion(version);

                if (!downloads.TryGetValue(downloadKey, out var candidate))
                {
                    var download = await source.DownloadAsync(kind, needed.Id, version, cancellation);
                    var metadata = PackageMetadata.Read(download.Bytes, kind == PackageKind.Plugin);

                    if (!string.Equals(metadata.Id, needed.Id, StringComparison.OrdinalIgnoreCase)
                        || metadata.Version != version || download.Sha512 != PlanJson.Hash(download.Bytes)
                        || download.Source != listing.Source)
                    {
                        throw new InvalidDataException("Package source changed identity, content hash or selected repository: " + downloadKey);
                    }

                    candidate = new(download with { Metadata = metadata }, PackageAssets.Dependencies(metadata, request.Framework));

                    if (metadata.Plugin != null && metadata.Plugin.Dependencies.Keys.Any(id =>
                        !candidate.Dependencies.Any(dependency => string.Equals(dependency.Id, id, StringComparison.OrdinalIgnoreCase))))
                    {
                        throw new InvalidDataException("Manifest dependency is absent from selected framework group: " + downloadKey);
                    }

                    downloads.Add(downloadKey, candidate);
                }

                var next = new Dictionary<string, Candidate>(graph.Nodes, StringComparer.Ordinal)
                {
                    [needed.Key] = candidate
                };
                var result = await Search(next);

                if (result != null)
                {
                    return result;
                }
            }

            return null;
        }

        return await Search(new(StringComparer.Ordinal)) ?? throw new ResolutionException(diagnostic);
    }

    internal static ResolvedGraph ExpandGraph(Requirement[] roots, Dictionary<string,
        NuGetVersion> platformPackages, Dictionary<string, Candidate> assignments)
    {
        var declaredShared = assignments.Values.Where(x => x.Metadata.Plugin != null).SelectMany(x =>
            x.Metadata.Plugin!.Dependencies.Where(d => d.Value == "shared").Select(d => d.Key)).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var edges = new List<Requirement>();
        var nodes = new Dictionary<string, Candidate>(StringComparer.Ordinal);
        var pending = new Queue<Requirement>(roots);

        while (pending.Count > 0)
        {
            var requirement = pending.Dequeue();
            edges.Add(requirement);

            if (requirement.Key.StartsWith("platform:", StringComparison.Ordinal))
            {
                if (!Matches(requirement.Range, platformPackages[requirement.Id]))
                {
                    throw new ResolutionException($"Platform {requirement.Id}/{platformPackages[requirement.Id]} does not satisfy {requirement.Range}: {requirement.Chain}");
                }

                continue;
            }

            if (!assignments.TryGetValue(requirement.Key, out var candidate))
            {
                continue;
            }

            if (!Matches(requirement.Range, candidate.Metadata.Version))
            {
                throw new ResolutionException($"Version conflict for {requirement.Key}: " + string.Join("; ",
                    edges.Where(x => x.Key == requirement.Key).Select(x => $"{x.Chain} requires {x.Range}")));
            }

            if (!nodes.TryAdd(requirement.Key, candidate))
            {
                continue;
            }

            var manifest = candidate.Metadata.Plugin;

            foreach (var dependency in candidate.Dependencies)
            {
                var kind = manifest?.Dependencies.GetValueOrDefault(dependency.Id) ?? "private";
                var owner = Scope(requirement.Key);

                if (manifest == null && assignments.TryGetValue(owner, out var owningPlugin))
                {
                    kind = owningPlugin.Metadata.Plugin?.Dependencies.GetValueOrDefault(dependency.Id) ?? kind;
                }

                if (manifest == null && owner == "shared" && declaredShared.Contains(dependency.Id))
                {
                    kind = "shared";
                }

                string key;

                if (platformPackages.ContainsKey(dependency.Id))
                {
                    if (manifest?.Dependencies.ContainsKey(dependency.Id) == true)
                    {
                        throw new ResolutionException("Platform package cannot be reclassified: " + dependency.Id);
                    }

                    kind = "platform";
                    key = "platform:" + dependency.Id;
                }
                else
                {
                    if (manifest != null && !manifest.Dependencies.ContainsKey(dependency.Id))
                    {
                        throw new ResolutionException("Plugin dependency kind not declared: " + dependency.Id);
                    }

                    key = kind == "plugin" ? "plugin:" + dependency.Id : kind == "shared" || owner == "shared"
                        ? "shared/" + dependency.Id : owner + "/" + dependency.Id;
                }

                pending.Enqueue(new(requirement.Key, key, dependency.Id, dependency.Range, kind,
                    requirement.Chain + " -> " + dependency.Id));
            }
        }

        foreach (var group in edges.Where(x => x.Kind != "platform").GroupBy(x => x.Id))
        {
            if (group.Any(x => x.Kind == "plugin") && group.Any(x => x.Kind != "plugin"))
            {
                throw new ResolutionException("Package used as both plugin and library: " + group.Key);
            }
        }

        return new(nodes, edges.ToArray(), PluginOrder(nodes, edges));
    }

    internal static string Scope(string key) => key.StartsWith("shared/", StringComparison.Ordinal) ? "shared" : key.Split('/')[0];

    private static bool Matches(VersionRange range, NuGetVersion version) => range.Satisfies(version)
        && (range.Float?.Satisfies(version) ?? true);

    internal static string PackageKey(Candidate candidate) =>
        candidate.Metadata.Id.ToLowerInvariant() + "/" + PackageMetadata.NormalizeVersion(candidate.Metadata.Version);

    private static string[] PluginOrder(Dictionary<string, Candidate> nodes, List<Requirement> edges)
    {
        var result = new List<string>();
        var visited = new HashSet<string>(StringComparer.Ordinal);
        var stack = new List<string>();

        void Visit(string key)
        {
            if (stack.Contains(key))
            {
                throw new ResolutionException("Plugin dependency cycle: " + string.Join(" -> ", stack.Append(key)));
            }

            if (!visited.Add(key))
            {
                return;
            }

            stack.Add(key);

            foreach (var dependency in edges.Where(x => x.From == key && x.Kind == "plugin").OrderBy(x => x.Key, StringComparer.Ordinal))
            {
                Visit(dependency.Key);
            }

            stack.RemoveAt(stack.Count - 1);

            if (nodes.ContainsKey(key))
            {
                result.Add(key);
            }
        }

        foreach (var key in nodes.Keys.Where(x => !x.Contains('/')).Order(StringComparer.Ordinal))
        {
            Visit(key);
        }

        return result.ToArray();
    }
}
