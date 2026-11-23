using ThinkingHome.Platform;
using System.Text.Json;
using NuGet.Versioning;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

/// <summary>
/// План одного запуска и отображение путей его файлов в физические пути локальных сборок и установки.
/// </summary>
/// <param name="Plan">Проверенные граф зависимостей и карта загрузки текущего запуска.</param>
/// <param name="Files">Физические пути по ключу «пакет/относительный путь».</param>
/// <remarks>План временный: локальные файлы не превращаются в устанавливаемый lock-файл.</remarks>
public sealed record ExecutionPlan(InstallationPlan Plan, IReadOnlyDictionary<string, string> Files);

/// <summary>
/// Строит общий план запуска из локальных сборок и проверенного установленного состояния без обращения к сети.
/// </summary>
public static class ExecutionPlanner
{
    /// <summary>
    /// Выбирает локальные плагины раньше установленных и проверяет итоговый граф общим планировщиком.
    /// </summary>
    /// <param name="request">Целевая платформа и корневые плагины запуска.</param>
    /// <param name="platform">Библиотеки и версии, предоставляемые хостом.</param>
    /// <param name="pluginPaths">Пути к локальным DLL с манифестами плагинов.</param>
    /// <param name="installed">Предварительно проверенный план установки, если установка существует.</param>
    /// <param name="packageDirectory">Каталог файлов по ключу пакета; обязателен при наличии установки.</param>
    /// <returns>План запуска и пути к выбранным файлам; установленное состояние не изменяется.</returns>
    public static ExecutionPlan Build(PlanRequest request, PlatformCatalog platform, string[] pluginPaths,
        InstallationPlan? installed = null, Func<string, string>? packageDirectory = null)
    {
        PackageAssets.ValidateTarget(request.Framework, request.Rid);

        if (request.Framework != platform.Framework || request.Rid != platform.Rid)
        {
            throw new InvalidDataException("Execution target differs from platform");
        }

        if (installed != null && packageDirectory == null)
        {
            throw new ArgumentException("Installed plan requires a package directory resolver", nameof(packageDirectory));
        }

        // DLL даёт идентичность плагина, а deps.json — файлы и версии его обычной сборки.
        var local = new Dictionary<string, LocalBuild>(StringComparer.OrdinalIgnoreCase);
        var pluginIds = (installed?.Lock.Packages.Where(x => x.Kind == "plugin").Select(x => x.Id) ?? [])
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var path in pluginPaths)
        {
            var manifest = PluginManifest.TryRead(Path.GetFullPath(path))
                ?? throw new InvalidDataException("Assembly is not a ThinkingHome plugin: " + path);
            pluginIds.Add(manifest.PackageId);
        }

        foreach (var path in pluginPaths)
        {
            var build = LocalBuild.Read(Path.GetFullPath(path), platform, pluginIds);

            if (!local.TryAdd(build.Main.Metadata.Id, build))
            {
                throw new ResolutionException("Duplicate local plugin: " + build.Main.Metadata.Id);
            }
        }

        pluginIds.UnionWith(local.Values.SelectMany(x => x.PluginDependencies));

        // Приводим установленный источник к тому же представлению выбранных файлов.
        var stored = new Dictionary<string, Candidate>(StringComparer.Ordinal);

        if (installed != null)
        {
            foreach (var package in installed.Lock.Packages)
            {
                var directory = packageDirectory!(package.Key);
                var archive = File.ReadAllBytes(Path.Combine(Path.GetDirectoryName(directory)!, "package.nupkg"));
                var metadata = PackageMetadata.Read(archive, package.Kind == "plugin");
                var selected = PackageAssets.Select(package.Files.Select(x => x.Path), request.Framework, request.Rid);
                var paths = selected.Managed.Concat(selected.Native).ToDictionary(x => x, x => Path.Combine(directory, x),
                    StringComparer.Ordinal);
                stored.Add(package.Key, FromFiles(metadata, new Uri(package.Source), PackageAssets.Dependencies(metadata,
                    request.Framework), paths));
            }
        }

        // Корни задают состав запуска; само наличие локального пути плагин не включает.
        var roots = request.Plugins.Select(x =>
        {
            PackageAssets.ValidateId(x.Id);
            var id = x.Id.ToLowerInvariant();

            return new Requirement("root", "plugin:" + id, id, VersionRange.Parse(x.Version), "plugin", id);
        }).ToArray();

        if (roots.Length == 0 || roots.Select(x => x.Id).Distinct().Count() != roots.Length)
        {
            throw new ResolutionException("Expected distinct root plugins");
        }

        var provided = platform.Packages.ToDictionary(x => x.Key.ToLowerInvariant(), x => NuGetVersion.Parse(x.Value));

        if (roots.Any(x => provided.ContainsKey(x.Id)))
        {
            throw new ResolutionException("Platform package cannot be a root plugin");
        }

        var assignments = new Dictionary<string, Candidate>(StringComparer.Ordinal);

        LocalBuild? LocalOwner(Candidate candidate) => local.Values.SingleOrDefault(x => ReferenceEquals(x.Main, candidate)
            || x.Libraries.Values.Any(value => ReferenceEquals(value, candidate)));

        ResolvedGraph graph;

        // Локальный плагин имеет приоритет. Несовместимость выбранной версии завершает проверку,
        // а не вызывает скрытый переход на установленную сборку.
        while (true)
        {
            graph = PackagePlanner.ExpandGraph(roots, provided, assignments, pluginIds);
            var needed = graph.Edges.FirstOrDefault(x => x.Kind != "platform" && !graph.Nodes.ContainsKey(x.Key));

            if (needed == null)
            {
                break;
            }

            Candidate? candidate = null;

            if (needed.Kind == "plugin" && local.TryGetValue(needed.Id, out var build))
            {
                candidate = build.Main;
            }
            else if (needed.Kind != "plugin" && assignments.TryGetValue(needed.From, out var parent) && parent.LocalFiles != null)
            {
                var owner = LocalOwner(parent);

                if (owner != null)
                {
                    owner.Libraries.TryGetValue(needed.Id, out candidate);
                }
            }

            if (candidate == null && installed != null)
            {
                var node = installed.Lock.Nodes.SingleOrDefault(x => x.Key == needed.Key);

                if (node != null)
                {
                    candidate = stored[node.Package];
                }
            }

            if (candidate == null)
            {
                throw new ResolutionException("Dependency is not connected or installed: " + needed.Chain);
            }

            if ((needed.Kind == "plugin") != (candidate.Metadata.Plugin != null))
            {
                throw new ResolutionException("Dependency kind differs from manifest: " + needed.Chain);
            }

            assignments.Add(needed.Key, candidate);
        }

        // Одинаковой версии shared-библиотеки недостаточно: содержимое источников должно совпадать.
        foreach (var edge in graph.Edges.Where(x => x.Kind == "shared"))
        {
            if (!graph.Nodes.TryGetValue(edge.From, out var parent))
            {
                continue;
            }

            var owner = LocalOwner(parent);
            var candidate = owner?.Libraries.GetValueOrDefault(edge.Id);

            if (candidate == null && installed?.Lock.Nodes.SingleOrDefault(x => x.Key == edge.Key) is { } storedNode)
            {
                candidate = stored[storedNode.Package];
            }

            if (candidate != null && candidate.Sha512 != graph.Nodes[edge.Key].Sha512)
            {
                throw new ResolutionException("Shared dependency content differs between connected sources: " + edge.Id);
            }
        }

        // Общая проверка контрактов и карта загрузки; установка и lock-файл остаются нетронутыми.
        var plan = PlanBuilder.Build(request, platform, graph, default);
        var files = new Dictionary<string, string>(StringComparer.Ordinal);

        foreach (var candidate in graph.Nodes.Values)
        {
            var key = PackagePlanner.PackageKey(candidate);

            foreach (var file in plan.Lock.Packages.Single(x => x.Key == key).Files)
            {
                var path = candidate.LocalFiles != null ? candidate.LocalFiles[file.Path] : Path.Combine(packageDirectory!(key), file.Path);
                files.TryAdd(key + "/" + file.Path, path);
            }
        }

        return new(plan, files);
    }

    private static Candidate FromFiles(PackageMetadata metadata, Uri source, PackageDependency[] dependencies,
        Dictionary<string, string> paths)
    {
        var hash = PlanJson.Hash(PlanJson.Bytes(paths
            .OrderBy(x => x.Key, StringComparer.Ordinal)
            .Select(x => new LockedFile(x.Key, PlanJson.Hash(File.ReadAllBytes(x.Value))))
            .ToArray()));

        return new(metadata, source, hash, dependencies, null, paths);
    }

    private sealed record LocalBuild(Candidate Main, Dictionary<string, Candidate> Libraries, HashSet<string> PluginDependencies)
    {
        public static LocalBuild Read(string path, PlatformCatalog platform, IReadOnlySet<string> connectedPlugins)
        {
            var manifest = PluginManifest.TryRead(path)
                ?? throw new InvalidDataException("Assembly is not a ThinkingHome plugin: " + path);
            var depsPath = Path.ChangeExtension(path, ".deps.json");
            using var document = JsonDocument.Parse(File.ReadAllBytes(depsPath));
            var targetName = document.RootElement.GetProperty("runtimeTarget").GetProperty("name").GetString()!;

            if (targetName != ".NETCoreApp,Version=v10.0" && targetName != ".NETCoreApp,Version=v10.0/" + platform.Rid)
            {
                throw new ResolutionException("Local build target differs from host: " + depsPath);
            }

            var target = document.RootElement.GetProperty("targets").GetProperty(targetName);
            var entries = target.EnumerateObject().ToDictionary(x => x.Name[..x.Name.LastIndexOf('/')], StringComparer.OrdinalIgnoreCase);
            var libraryKinds = document.RootElement.GetProperty("libraries");
            var aliases = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            // SDK может описать одну DLL и как пакет, и как reference с другим именем.
            // Убираем такие псевдонимы и явно встроенные библиотеки из пакетных зависимостей.
            foreach (var entry in entries.Values.Where(x => libraryKinds.GetProperty(x.Name).GetProperty("type")
                .GetString() == "reference"))
            {
                var id = entry.Name[..entry.Name.LastIndexOf('/')];
                var names = entry.Value.TryGetProperty("runtime", out var runtime)
                    ? runtime.EnumerateObject().Select(x => x.Name).ToArray()
                    : [];

                if (manifest.Embedded.ContainsKey(id) || entries.Values.Any(other => other.Name != entry.Name
                    && libraryKinds.GetProperty(other.Name).GetProperty("type").GetString() != "reference"
                    && other.Value.TryGetProperty("runtime", out var assets) && names.All(name => assets.TryGetProperty(name, out _))))
                {
                    aliases.Add(id);
                }
            }

            var mainEntry = target.EnumerateObject().Single(x => x.Value.TryGetProperty("runtime", out var runtime)
                && runtime.EnumerateObject().Any(a => a.Name == Path.GetFileName(path)));
            var directory = Path.GetDirectoryName(path)!;
            var libraries = new Dictionary<string, Candidate>(StringComparer.OrdinalIgnoreCase);
            var plugins = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            Candidate ReadCandidate(JsonProperty entry, PluginManifest? plugin)
            {
                var slash = entry.Name.LastIndexOf('/');
                var id = plugin?.PackageId ?? entry.Name[..slash];
                PackageAssets.ValidateId(id);
                var version = NuGetVersion.Parse(entry.Name[(slash + 1)..]);

                if (plugin != null && version != plugin.Version)
                {
                    throw new ResolutionException("DLL and deps.json version mismatch: " + path);
                }

                // deps.json содержит разрешённые версии, а не исходные диапазоны NuGet.
                // Фиксируем их точно; для предоставляемых платформой пакетов это нижняя граница.
                var dependencies = entry.Value.TryGetProperty("dependencies", out var dependenciesJson)
                    ? dependenciesJson.EnumerateObject()
                        .Where(x => !aliases.Contains(x.Name))
                        .Select(x => new PackageDependency(
                            x.Name.ToLowerInvariant(),
                            VersionRange.Parse(platform.Packages.ContainsKey(x.Name)
                                ? x.Value.GetString()!
                                : "[" + x.Value.GetString() + "]")))
                        .ToArray()
                    : [];

                if (plugin != null && plugin.Dependencies.Keys.Any(id => !dependencies.Any(x => x.Id.Equals(id,
                    StringComparison.OrdinalIgnoreCase))))
                {
                    throw new ResolutionException("Manifest dependency absent from deps.json: " + id);
                }

                var paths = new Dictionary<string, string>(StringComparer.Ordinal);

                void Assets(string property)
                {
                    if (!entry.Value.TryGetProperty(property, out var section))
                    {
                        return;
                    }

                    foreach (var asset in section.EnumerateObject())
                    {
                        var original = asset.Name;

                        // deps.json содержит варианты для разных RID; выбираем только совместимые с хостом.
                        if (property == "runtimeTargets" && !PackageAssets.IncludesRid(platform.Rid,
                            asset.Value.GetProperty("rid").GetString()!))
                        {
                            continue;
                        }

                        if (Path.IsPathRooted(original) || original.Contains('\\') || original.Contains(':')
                            || original.Split('/').Any(x => x is "." or ".."))
                        {
                            throw new InvalidDataException("Unsafe deps.json asset: " + original);
                        }

                        if (Path.GetFileName(original) == "_._")
                        {
                            continue;
                        }

                        var native = property == "native" || (property == "runtimeTargets"
                            && asset.Value.GetProperty("assetType").GetString() == "native");
                        var culture = property == "resources" ? asset.Value.GetProperty("locale").GetString() + "/" : "";

                        if (culture.Contains('\\') || culture.Contains(':') || culture.TrimEnd('/').Split('/').Any(x =>
                            x is "." or "..") || culture.Count(x => x == '/') > 1)
                        {
                            throw new InvalidDataException("Unsafe resource culture: " + culture);
                        }

                        var virtualPath = property == "runtimeTargets" || original.StartsWith("lib/", StringComparison.Ordinal)
                            ? original
                            : native
                                ? "runtimes/" + platform.Rid + "/native/" + Path.GetFileName(original)
                                : "lib/net10.0/" + culture + Path.GetFileName(original);
                        var physical = property == "runtimeTargets" ? Path.Combine(directory, original)
                            : Path.Combine(directory, culture, Path.GetFileName(original));

                        if (!File.Exists(physical) && property == "runtimeTargets")
                        {
                            physical = Path.Combine(directory, Path.GetFileName(original));
                        }

                        paths.Add(virtualPath, physical);
                    }
                }

                Assets("runtime");
                Assets("resources");
                Assets("native");
                Assets("runtimeTargets");

                if (plugin != null)
                {
                    foreach (var embedded in plugin.Embedded.Keys)
                    {
                        PackageAssets.ValidateId(embedded);
                        var embeddedPath = "lib/net10.0/" + embedded + ".dll";
                        paths.TryAdd(embeddedPath, Path.Combine(directory, embedded + ".dll"));
                    }
                }

                // В каталоге сборки обязаны присутствовать только файлы выбранного RID.
                var selected = PackageAssets.Select(paths.Keys, platform.Framework, platform.Rid);
                paths = selected.Managed.Concat(selected.Native).ToDictionary(x => x, x => paths[x], StringComparer.Ordinal);

                return FromFiles(new(id, version, [], plugin), new Uri(path), dependencies, paths);
            }

            var main = ReadCandidate(mainEntry, manifest);

            // Обходим библиотеки сборки. Зависимые плагины подключаются отдельно, даже если их DLL скопированы рядом.
            var pending = new Queue<string>(main.Dependencies.Select(x => x.Id));

            while (pending.TryDequeue(out var id))
            {
                if (libraries.ContainsKey(id) || platform.Packages.Keys.Contains(id, StringComparer.OrdinalIgnoreCase)
                    || connectedPlugins.Contains(id) || plugins.Contains(id))
                {
                    continue;
                }

                if (!entries.TryGetValue(id, out var entry))
                {
                    throw new ResolutionException("Dependency absent from deps.json: " + id);
                }

                var library = ReadCandidate(entry, null);
                var selected = PackageAssets.Select(library.LocalFiles!.Keys, platform.Framework, platform.Rid);
                var markers = selected.Managed.Where(x => !x.EndsWith(".resources.dll", StringComparison.OrdinalIgnoreCase))
                    .Select(x => PluginManifest.TryRead(library.LocalFiles[x]))
                    .Where(x => x != null).ToArray();

                if (markers.Length > 0)
                {
                    if (markers.Length != 1 || !markers[0]!.PackageId.Equals(id, StringComparison.OrdinalIgnoreCase)
                        || markers[0]!.Version != library.Metadata.Version)
                        throw new ResolutionException("Plugin dependency identity differs from deps.json: " + id);
                    plugins.Add(id);
                    continue;
                }

                libraries.Add(id, library);

                foreach (var dependency in library.Dependencies)
                {
                    pending.Enqueue(dependency.Id);
                }
            }

            return new(main, libraries, plugins);
        }
    }
}
