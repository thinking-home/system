using ThinkingHome.Platform;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Loader;
using ThinkingHome.Core.Plugins;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackagePlanning;

namespace ThinkingHome.PackageRuntime;

/// <summary>
/// Владеет планом, снимком установки и контекстами загрузки на время одного запуска хоста.
/// </summary>
/// <remarks>Состав плагинов меняется только после перезапуска процесса.</remarks>
public sealed class PluginRuntime : IDisposable
{
    private readonly InstallationSnapshot? snapshot;
    private readonly IReadOnlyDictionary<string, string>? files;

    /// <summary>
    /// Фактический план запуска с учётом локальных подключений; не предназначен для сохранения как lock-файл.
    /// </summary>
    public InstallationPlan Plan { get; }

    private readonly Dictionary<string, PluginContext> contexts = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> platformPaths;
    private readonly LoadAsset[] assets;

    /// <summary>
    /// Проверенные точки входа плагинов в порядке зависимостей.
    /// </summary>
    public IReadOnlyList<Type> PluginTypes { get; }

    /// <summary>
    /// Удерживаемое установленное состояние или null при запуске только локальных сборок.
    /// </summary>
    public InstalledState? State => snapshot?.State;

    /// <summary>
    /// Проверяет установку, применяет локальные подключения и загружает типы без запуска жизненного цикла.
    /// </summary>
    /// <param name="directory">Каталог установки и plugins.local.json; относительные подключения считаются от него.</param>
    /// <param name="platform">Каталог платформы текущего процесса.</param>
    /// <returns>Владелец загруженных типов, который нужно освободить после остановки плагинов.</returns>
    public static PluginRuntime Open(string directory, PlatformCatalog platform)
    {
        directory = Path.GetFullPath(directory);
        var manager = new PackageManager(directory, platform);
        InstallationSnapshot? snapshot = null;

        try
        {
            // Проверяем тот же снимок, файлы которого удерживаем на весь запуск.
            if (File.Exists(Path.Combine(directory, ".thinkinghome/current.json")))
            {
                snapshot = manager.OpenSnapshot();
                manager.Validate(snapshot);
            }

            var configuration = Path.Combine(directory, "plugins.local.json");

            if (!File.Exists(configuration))
            {
                if (snapshot == null)
                {
                    throw new InvalidDataException("No installed plugins or plugins.local.json: " + directory);
                }

                return new(snapshot, platform, snapshot.State.Plan, null);
            }

            var local = PlanJson.Read<LocalConnections>(configuration);

            if (local.PluginPaths == null || local.Plugins == null)
            {
                throw new InvalidDataException("Local connection arrays cannot be null");
            }

            // Пути объявляют источники; активируем только корни и их зависимости.
            var roots = (snapshot?.State.Request.Plugins ?? []).ToDictionary(x => x.Id, StringComparer.OrdinalIgnoreCase);

            if (local.Plugins.Select(x => x.Id).Distinct(StringComparer.OrdinalIgnoreCase).Count() != local.Plugins.Length)
            {
                throw new InvalidDataException("Duplicate local root plugin");
            }

            // Явный локальный запрос заменяет диапазон установленного корневого плагина.
            foreach (var root in local.Plugins)
            {
                roots[root.Id] = root;
            }

            var request = new PlanRequest(platform.Framework, platform.Rid, roots.Values.ToArray());
            var execution = ExecutionPlanner.Build(
                request, platform,
                local.PluginPaths.Select(x => Path.GetFullPath(x, directory)).ToArray(),
                snapshot?.State.Plan,
                snapshot == null ? null : snapshot.PackageDirectory);

            return new(snapshot, platform, execution.Plan, execution.Files);
        }
        catch
        {
            snapshot?.Dispose();
            throw;
        }
    }

    private sealed record LocalConnections
    {
        public string[] PluginPaths { get; init; } = [];

        public RootPlugin[] Plugins { get; init; } = [];
    }

    private PluginRuntime(InstallationSnapshot? snapshot, PlatformCatalog platform, InstallationPlan plan,
        IReadOnlyDictionary<string, string>? files)
    {
        this.snapshot = snapshot;
        this.files = files;
        Plan = plan;

        if (platform.Rid != HostPlatform.CurrentRid)
        {
            throw new InvalidDataException($"Cannot execute {platform.Rid} on {RuntimeInformation.RuntimeIdentifier}");
        }

        assets = Plan.LoadMap.Assets;
        platformPaths = platform.Assemblies.ToDictionary(x => AssemblyName.GetAssemblyName(x).Name!, Path.GetFullPath,
            StringComparer.OrdinalIgnoreCase);

        // Владелец определяет контекст: общий для shared и отдельный для каждого плагина.
        foreach (var scope in assets.Select(x => x.Owner).Where(x => x != "platform").Distinct())
        {
            contexts.Add(scope, new PluginContext(this, scope));
        }

        var types = new List<Type>();

        try
        {
            // Загружаем точки входа, обнаруженные при проверке плана, без создания экземпляров.
            foreach (var key in Plan.Lock.PluginOrder)
            {
                var node = Plan.Lock.Nodes.Single(x => x.Key == key);
                var candidates = assets.Where(x => x.Scope == key && x.Owner == key && x.Package == node.Package
                    && x.Kind == "managed").ToArray();

                foreach (var entry in node.EntryPoints)
                {
                    var matches = candidates.Select(x => Resolve(x, new AssemblyName(x.Identity!)).GetType(entry, false))
                        .Where(x => x != null).ToArray();

                    if (matches.Length != 1 || matches[0]!.IsAbstract || !typeof(PluginBase).IsAssignableFrom(matches[0]))
                    {
                        throw new InvalidDataException("Invalid runtime entry point: " + entry);
                    }

                    types.Add(matches[0]!);
                }
            }

            PluginTypes = types;
        }
        catch
        {
            foreach (var context in contexts.Values)
            {
                context.Unload();
            }

            throw;
        }
    }

    private string AssetPath(LoadAsset asset)
    {
        var path = asset.Owner == "platform"
            ? platformPaths[asset.Name]
            : files != null
                ? files[asset.Package + "/" + asset.Path]
                : Path.GetFullPath(Path.Combine(snapshot!.PackageDirectory(asset.Package!), asset.Path!));

        // Повторная проверка непосредственно перед первой загрузкой защищает от обычного изменения файлов после preflight.
        if (PlanJson.Hash(File.ReadAllBytes(path)) != asset.Sha512)
        {
            throw new InvalidDataException("Runtime asset changed: " + path);
        }

        return path;
    }

    private Assembly Resolve(LoadAsset asset, AssemblyName requested)
    {
        var identity = new AssemblyName(asset.Identity!);
        var token = requested.GetPublicKeyToken() ?? [];

        if (!AssemblyName.ReferenceMatchesDefinition(requested, identity) || requested.Version > identity.Version
            || !string.Equals(requested.CultureName ?? "", identity.CultureName ?? "", StringComparison.OrdinalIgnoreCase)
            || ((requested.Version != null || token.Length > 0) && !token.SequenceEqual(identity.GetPublicKeyToken() ?? [])))
        {
            throw new FileLoadException($"Incompatible binding {requested} -> {identity}");
        }

        // Ссылка на другой плагин возвращает сборку из его контекста и сохраняет идентичность типов.
        var owner = asset.Owner == "platform" ? AssemblyLoadContext.Default : contexts[asset.Owner];
        var loaded = owner.Assemblies.SingleOrDefault(x =>
            x.GetName().Name == identity.Name && x.GetName().CultureName == identity.CultureName);

        if (loaded != null)
        {
            if (loaded.FullName != identity.FullName || PlanJson.Hash(File.ReadAllBytes(loaded.Location)) != asset.Sha512)
            {
                throw new FileLoadException("Already loaded assembly differs from plan: " + identity);
            }

            return loaded;
        }

        return owner.LoadFromAssemblyPath(AssetPath(asset));
    }

    /// <summary>
    /// Освобождает снимок установки и запрашивает выгрузку контекстов. Горячая перезагрузка не поддерживается.
    /// </summary>
    public void Dispose()
    {
        foreach (var context in contexts.Values)
        {
            context.Unload();
        }

        contexts.Clear();
        ((List<Type>)PluginTypes).Clear();
        snapshot?.Dispose();
    }

    private sealed class PluginContext(PluginRuntime runtime, string scope) : AssemblyLoadContext("ThinkingHome:" + scope,
        isCollectible: true)
    {
        protected override Assembly? Load(AssemblyName name)
        {
            var culture = name.CultureName ?? "";
            var asset = runtime.assets.SingleOrDefault(x =>
                x.Scope == scope && x.Kind is "managed" or "resource"
                && string.Equals(x.Name, name.Name, StringComparison.OrdinalIgnoreCase)
                && string.Equals(x.Culture ?? "", culture, StringComparison.OrdinalIgnoreCase));

            // ResourceManager использует отсутствие спутника для перехода к родительской культуре.
            if (asset == null && culture.Length > 0 && name.Name!.EndsWith(".resources", StringComparison.Ordinal))
            {
                return null;
            }

            if (asset == null)
            {
                throw new FileNotFoundException($"Undeclared assembly {name} in {scope}");
            }

            return runtime.Resolve(asset, name);
        }

        protected override IntPtr LoadUnmanagedDll(string name)
        {
            var normalized = Path.GetFileName(name);

            if (OperatingSystem.IsWindows())
            {
                if (normalized.EndsWith(".dll", StringComparison.OrdinalIgnoreCase))
                {
                    normalized = normalized[..^4];
                }

                normalized = normalized.ToLowerInvariant();
            }
            else
            {
                if (normalized.StartsWith("lib", StringComparison.Ordinal))
                {
                    normalized = normalized[3..];
                }

                if (normalized.EndsWith(".so", StringComparison.Ordinal))
                {
                    normalized = normalized[..^3];
                }
            }

            var asset = runtime.assets.SingleOrDefault(x => x.Scope == scope && x.Kind == "native" && x.Name == normalized);

            if (asset != null)
            {
                return LoadUnmanagedDllFromPath(runtime.AssetPath(asset));
            }

            // ОС разрешает системные native-библиотеки; для пакетных файлов карта задаёт точный путь.
            return IntPtr.Zero;
        }
    }
}
