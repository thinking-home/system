using ThinkingHome.Platform;
using System.Reflection;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using NuGet.Versioning;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackagePlanning;

internal static class PlanBuilder
{
    private sealed record Managed(LoadAsset Asset, string File, AssemblyName Identity, string Policy);

    internal static InstallationPlan Build(PlanRequest request, PlatformCatalog platform, ResolvedGraph graph,
        CancellationToken cancellation)
    {
        var temporary = Path.Combine(Path.GetTempPath(), "thinkinghome-plan-" + Guid.NewGuid().ToString("N"));
        Directory.CreateDirectory(temporary);

        try
        {
            return BuildInDirectory(request, platform, graph, temporary, cancellation);
        }
        finally
        {
            Directory.Delete(temporary, recursive: true);
        }
    }

    private static InstallationPlan BuildInDirectory(PlanRequest request, PlatformCatalog platform, ResolvedGraph graph,
        string temporary, CancellationToken cancellation)
    {
        var packages = new SortedDictionary<string, LockedPackage>(StringComparer.Ordinal);
        var contents = new Dictionary<string, SortedDictionary<string, byte[]>>(StringComparer.Ordinal);
        var selected = new Dictionary<string, SelectedAssets>(StringComparer.Ordinal);

        foreach (var candidate in graph.Nodes.Values)
        {
            cancellation.ThrowIfCancellationRequested();
            var key = PackagePlanner.PackageKey(candidate);

            if (packages.TryGetValue(key, out var previous))
            {
                if (previous.Sha512 != candidate.Sha512)
                {
                    throw new ResolutionException("Conflicting package content: " + key);
                }

                continue;
            }

            var files = candidate.ReadFiles();

            if (files.ContainsKey("runtime.json"))
            {
                throw new ResolutionException("Package-specific runtime graphs are not supported; publish ready assets and nuspec dependencies: " + key);
            }

            contents.Add(key, files);
            selected.Add(key, PackageAssets.Select(files.Keys, request.Framework, request.Rid));
            packages.Add(key, new(key, candidate.Metadata.Id, PackageMetadata.NormalizeVersion(candidate.Metadata.Version),
                candidate.Metadata.Plugin == null ? "library" : "plugin", candidate.Source.AbsoluteUri, candidate.Sha512,
                files.Select(x => new LockedFile(x.Key, PlanJson.Hash(x.Value))).ToArray()));
        }

        var managed = new List<Managed>();
        var assets = new List<LoadAsset>();
        var platformRecords = new List<PlatformAssembly>();

        foreach (var file in platform.Assemblies.Order(StringComparer.Ordinal))
        {
            var identity = AssemblyName.GetAssemblyName(file);
            var bytes = File.ReadAllBytes(file);
            CheckManaged(bytes, file);

            if (managed.Any(x => string.Equals(x.Identity.Name, identity.Name, StringComparison.OrdinalIgnoreCase)))
            {
                throw new InvalidDataException("Duplicate platform assembly: " + identity.Name);
            }

            var asset = new LoadAsset("platform", "platform", "managed", identity.Name!, identity.FullName, null, null,
                PlanJson.Hash(bytes));
            managed.Add(new(asset, Path.GetFullPath(file), identity, "platform"));
            assets.Add(asset);
            platformRecords.Add(new(identity.FullName, asset.Sha512));
        }

        if (!managed.Any(x => x.Identity.Name == "System.Private.CoreLib") || !managed.Any(x =>
            x.Identity.Name == "ThinkingHome.Core.Plugins"))
        {
            throw new InvalidDataException("Platform must explicitly provide System.Private.CoreLib and ThinkingHome.Core.Plugins");
        }

        var mainByNode = new Dictionary<string, Managed>(StringComparer.Ordinal);
        var publicShared = graph.Edges.Where(x => x.Kind == "shared").Select(x => x.Key).ToHashSet(StringComparer.Ordinal);

        foreach (var (node, candidate) in graph.Nodes.OrderBy(x => x.Key, StringComparer.Ordinal))
        {
            var package = PackagePlanner.PackageKey(candidate);
            var scope = PackagePlanner.Scope(node);
            var manifest = candidate.Metadata.Plugin;
            var local = new List<Managed>();

            foreach (var path in selected[package].Managed)
            {
                cancellation.ThrowIfCancellationRequested();
                var bytes = contents[package][path];
                var file = Path.Combine(temporary, package.Replace('/', Path.DirectorySeparatorChar), path.Replace('/',
                    Path.DirectorySeparatorChar));
                Directory.CreateDirectory(Path.GetDirectoryName(file)!);
                File.WriteAllBytes(file, bytes);
                var identity = AssemblyName.GetAssemblyName(file);

                CheckManaged(bytes, path);
                var culture = identity.CultureName;
                var satellite = !string.IsNullOrEmpty(culture);

                if (satellite && !identity.Name!.EndsWith(".resources", StringComparison.Ordinal))
                {
                    throw new ResolutionException("Unexpected managed assembly culture: " + path);
                }

                var owner = manifest?.Embedded.GetValueOrDefault(identity.Name!) == "shared" ? "shared" : scope;
                var policy = manifest != null ? manifest.Embedded.GetValueOrDefault(identity.Name!, "plugin")
                    : publicShared.Contains(node) ? "shared" : "private";
                var asset = new LoadAsset(owner, owner, satellite ? "resource" : "managed", identity.Name!,
                    identity.FullName, package, path, PlanJson.Hash(bytes), satellite ? culture : null);
                assets.Add(asset);

                if (!satellite)
                {
                    var value = new Managed(asset, file, identity, policy);
                    local.Add(value);
                    managed.Add(value);
                }
            }

            if (manifest != null)
            {
                // Метаданные выбранной runtime-DLL обязаны совпадать с канонической DLL пакета.
                var possible = local.Where(x => !manifest.Embedded.ContainsKey(x.Identity.Name!)).ToArray();

                if (possible.Length != 1)
                {
                    throw new ResolutionException("Expected one plugin assembly and declared embedded libraries: " + package);
                }

                mainByNode.Add(node, possible[0]);

                foreach (var name in manifest.Embedded.Keys)
                {
                    if (!local.Any(x => x.Identity.Name == name))
                    {
                        throw new ResolutionException("Missing embedded assembly: " + name);
                    }
                }
            }

            foreach (var path in selected[package].Native)
            {
                var name = NativeName(path, request.Rid);
                assets.Add(new(scope, scope, "native", name, null, package, path, PlanJson.Hash(contents[package][path])));
            }
        }

        // В одной области имя имеет ровно одного владельца; даже одинаковые DLL разных пакетов не угадываем.
        var owners = assets.ToArray();

        void AddImport(string scope, LoadAsset asset)
        {
            if (scope != asset.Owner && asset.Kind != "native")
            {
                assets.Add(asset with { Scope = scope });
            }
        }

        var scopes = graph.Nodes.Keys.Select(PackagePlanner.Scope).Append("shared").Distinct().Order(StringComparer.Ordinal).ToArray();

        foreach (var scope in scopes)
        {
            foreach (var item in owners.Where(x => x.Owner == "platform"))
            {
                AddImport(scope, item);
            }

            foreach (var node in graph.Nodes.Where(x => PackagePlanner.Scope(x.Key) == scope))
            {
                foreach (var item in owners.Where(x => x.Owner == "shared" && x.Package == PackagePlanner.PackageKey(node.Value)))
                {
                    AddImport(scope, item);
                }
            }

            var reachable = new HashSet<string>(StringComparer.Ordinal);

            void Imports(string node)
            {
                if (!reachable.Add(node))
                {
                    return;
                }

                foreach (var edge in graph.Edges.Where(x => x.From == node && x.Kind is "plugin" or "shared"))
                {
                    if (!graph.Nodes.TryGetValue(edge.Key, out var target))
                    {
                        continue;
                    }

                    var package = PackagePlanner.PackageKey(target);

                    foreach (var item in owners.Where(x => x.Package == package && (x.Owner == "shared"
                        || (mainByNode.TryGetValue(edge.Key, out var main) && (x.Name == main.Identity.Name
                        || x.Name == main.Identity.Name + ".resources")))))
                    {
                        AddImport(scope, item);
                    }

                    Imports(edge.Key);
                }
            }

            foreach (var node in graph.Nodes.Keys.Where(x => PackagePlanner.Scope(x) == scope))
            {
                Imports(node);
            }
        }

        assets = assets.Distinct().ToList();

        foreach (var group in assets.GroupBy(x => (x.Scope, x.Kind, Name: x.Name.ToLowerInvariant(), x.Culture)))
        {
            if (group.Count() > 1)
            {
                throw new ResolutionException($"Assembly/resource name conflict in {group.Key.Scope}: {group.Key.Name}: " + string.Join(", ", group.Select(x => x.Package ?? "platform")));
            }
        }

        var entryPoints = new Dictionary<string, string[]>(StringComparer.Ordinal);

        foreach (var scope in scopes)
        {
            cancellation.ThrowIfCancellationRequested();
            var visibleAssets = assets.Where(x => x.Scope == scope && x.Kind == "managed").ToArray();
            var visible = visibleAssets.Select(asset => managed.First(x => x.Asset.Owner == asset.Owner
                && x.Asset.Package == asset.Package && x.Asset.Path == asset.Path && x.Asset.Name == asset.Name))
                .ToDictionary(x => x.Identity.Name!, StringComparer.OrdinalIgnoreCase);

            // Для обхода API общей библиотеки нужны её внутренние ссылки, но они не становятся импортами плагина.
            var resolver = new Dictionary<string, Managed>(visible, StringComparer.OrdinalIgnoreCase);

            foreach (var value in managed.Where(x => x.Asset.Owner == "shared"))
            {
                resolver.TryAdd(value.Identity.Name!, value);
            }

            using var context = new MetadataLoadContext(new PathAssemblyResolver(resolver.Values.Select(x => x.File)),
                "System.Private.CoreLib");
            var policies = resolver.ToDictionary(x => x.Key, x => new AssemblyPolicy(x.Value.Policy,
                x.Value.Asset.Package ?? "platform"), StringComparer.OrdinalIgnoreCase);

            foreach (var value in visible.Values.Where(x => x.Asset.Owner == scope))
            {
                var assembly = context.LoadFromAssemblyPath(value.File);

                if (value.Policy != "plugin" && assembly.GetCustomAttributesData().Any(x =>
                    x.AttributeType.FullName == typeof(AssemblyMetadataAttribute).FullName
                    && x.ConstructorArguments.Count == 2 && x.ConstructorArguments[0].Value is string key
                    && key.StartsWith(PluginManifest.Prefix, StringComparison.Ordinal)))
                {
                    throw new ResolutionException("Plugin assembly cannot be loaded as a library: " + value.Asset.Package);
                }

                foreach (var reference in assembly.GetReferencedAssemblies())
                {
                    if (!visible.TryGetValue(reference.Name!, out var resolved) || !Compatible(reference, resolved.Identity))
                    {
                        throw new ResolutionException($"Unresolved or incompatible reference in {scope}: {value.Identity.Name} -> {reference.FullName}");
                    }
                }
            }

            if (mainByNode.TryGetValue(scope, out var main))
            {
                try
                {
                    var assembly = context.LoadFromAssemblyPath(main.File);
                    var actual = PluginManifest.Read(assembly);
                    var expected = graph.Nodes[scope].Metadata.Plugin!;

                    if (ManifestSignature(actual) != ManifestSignature(expected))
                    {
                        throw new ResolutionException("Runtime plugin manifest differs from package manifest: " + scope);
                    }

                    // Список выводится из выбранной DLL после разрешения всех зависимостей.
                    entryPoints.Add(scope, PluginEntryPoints.Discover(assembly));
                    var errors = new ContractValidator(policies).Validate(assembly);

                    if (errors.Count != 0)
                    {
                        throw new ResolutionException(scope + ": " + string.Join(Environment.NewLine, errors));
                    }
                }
                catch (Exception ex) when (ex is FileNotFoundException or TypeLoadException or ReflectionTypeLoadException or BadImageFormatException)
                {
                    throw new ResolutionException("Contract resolution failed for " + scope + ": " + ex.Message);
                }
            }
        }

        foreach (var satellite in assets.Where(x => x.Kind == "resource"))
        {
            if (!assets.Any(x => x.Kind == "managed" && x.Scope == satellite.Scope && x.Package == satellite.Package
                && x.Name + ".resources" == satellite.Name))
            {
                throw new ResolutionException("Satellite has no owner: " + satellite.Path);
            }
        }

        var duplicateEntry = entryPoints.Values.SelectMany(x => x)
            .GroupBy(x => x, StringComparer.Ordinal).FirstOrDefault(x => x.Count() > 1);

        if (duplicateEntry != null)
        {
            throw new ResolutionException("Duplicate plugin entry point: " + duplicateEntry.Key);
        }

        var roots = request.Plugins.Select(x => new RootPlugin(x.Id.ToLowerInvariant(),
            VersionRange.Parse(x.Version).ToString())).OrderBy(x => x.Id, StringComparer.Ordinal).ToArray();
        var locked = new PluginLock(1, request.Framework, request.Rid, roots, new(platform.Version,
            new SortedDictionary<string, string>(platform.Packages.ToDictionary(x => x.Key.ToLowerInvariant(), x =>
            PackageMetadata.NormalizeVersion(NuGetVersion.Parse(x.Value))), StringComparer.Ordinal),
            platformRecords.OrderBy(x => x.Identity, StringComparer.Ordinal).ToArray()), packages.Values.ToArray(),
            graph.Nodes.OrderBy(x => x.Key, StringComparer.Ordinal).Select(x => new LockedNode(x.Key,
            PackagePlanner.Scope(x.Key), PackagePlanner.PackageKey(x.Value),
            entryPoints.GetValueOrDefault(x.Key, []))).ToArray(),
            graph.Edges.Select(x => new LockedEdge(x.From, x.Key, x.Id, x.Range.ToString(), x.Kind)).Distinct().OrderBy(x =>
            x.From, StringComparer.Ordinal).ThenBy(x => x.To, StringComparer.Ordinal).ThenBy(x => x.Range,
            StringComparer.Ordinal).ToArray(), graph.PluginOrder);

        return new(locked, new(1, request.Framework, request.Rid, PlanJson.Hash(PlanJson.Bytes(locked)), assets.OrderBy(x =>
            x.Scope, StringComparer.Ordinal).ThenBy(x => x.Kind, StringComparer.Ordinal).ThenBy(x => x.Name,
            StringComparer.Ordinal).ThenBy(x => x.Culture, StringComparer.Ordinal).ToArray()));
    }

    private static string ManifestSignature(PluginManifest manifest) => string.Join('|',
        manifest.PackageId.ToLowerInvariant(), manifest.Version, string.Join(',', manifest.Dependencies.OrderBy(x => x.Key).Select(x =>
        x.Key.ToLowerInvariant() + "=" + x.Value)), string.Join(',', manifest.Embedded.OrderBy(x => x.Key).Select(x =>
        x.Key + "=" + x.Value)));

    private static bool Compatible(AssemblyName reference, AssemblyName resolved) => string.Equals(reference.Name,
        resolved.Name, StringComparison.OrdinalIgnoreCase) && (resolved.Version == null || reference.Version == null
        || resolved.Version >= reference.Version) && (reference.CultureName ?? "") == (resolved.CultureName ?? "")
        && (reference.GetPublicKeyToken() ?? []).SequenceEqual(resolved.GetPublicKeyToken() ?? []);

    private static void CheckManaged(byte[] bytes, string path)
    {
        using var pe = new PEReader(new MemoryStream(bytes));

        if (pe.PEHeaders.CorHeader == null || (pe.PEHeaders.CorHeader.Flags & CorFlags.Requires32Bit) != 0)
        {
            throw new ResolutionException("Unsupported managed architecture: " + path);
        }

        if (pe.PEHeaders.CoffHeader.Machine is not (Machine.I386 or Machine.Amd64))
        {
            throw new ResolutionException("Managed asset does not target x64 or AnyCPU: " + path);
        }

        var reader = pe.GetMetadataReader();

        foreach (var handle in reader.GetAssemblyDefinition().GetCustomAttributes())
        {
            var attribute = reader.GetCustomAttribute(handle);
            EntityHandle typeHandle;

            if (attribute.Constructor.Kind == HandleKind.MemberReference)
            {
                typeHandle = reader.GetMemberReference((MemberReferenceHandle)attribute.Constructor).Parent;
            }
            else if (attribute.Constructor.Kind == HandleKind.MethodDefinition)
            {
                typeHandle = reader.GetMethodDefinition((MethodDefinitionHandle)attribute.Constructor).GetDeclaringType();
            }
            else
            {
                continue;
            }

            string ns;
            string name;

            if (typeHandle.Kind == HandleKind.TypeReference)
            {
                var type = reader.GetTypeReference((TypeReferenceHandle)typeHandle);
                ns = reader.GetString(type.Namespace);
                name = reader.GetString(type.Name);
            }
            else if (typeHandle.Kind == HandleKind.TypeDefinition)
            {
                var type = reader.GetTypeDefinition((TypeDefinitionHandle)typeHandle);
                ns = reader.GetString(type.Namespace);
                name = reader.GetString(type.Name);
            }
            else
            {
                continue;
            }

            if (ns == "System.Runtime.CompilerServices" && name == "ReferenceAssemblyAttribute")
            {
                throw new ResolutionException("Reference assembly cannot execute: " + path);
            }
        }
    }

    private static string NativeName(string path, string rid)
    {
        var name = Path.GetFileName(path);

        if (rid == "win-x64")
        {
            return name.EndsWith(".dll", StringComparison.OrdinalIgnoreCase) ? name[..^4].ToLowerInvariant() : name.ToLowerInvariant();
        }

        if (name.StartsWith("lib", StringComparison.Ordinal))
        {
            name = name[3..];
        }

        return name.EndsWith(".so", StringComparison.Ordinal) ? name[..^3] : name;
    }
}
