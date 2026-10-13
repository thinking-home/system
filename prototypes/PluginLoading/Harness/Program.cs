using System.Reflection;
using System.Reflection.Metadata;
using System.Reflection.PortableExecutable;
using System.Runtime.Loader;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;

if (args.Length != 2) {
    throw new ArgumentException("Usage: Harness <repository-root> <Debug|Release>");
}

var root = Path.GetFullPath(args[0]);
var configuration = args[1];
string Output(string project, string assembly) => Path.Combine(root, "prototypes", "PluginLoading",
    project, "bin", configuration, "net10.0", assembly + ".dll");

var checks = 0;
void Check(bool condition, string scenario) {
    if (!condition) throw new InvalidOperationException("FAIL: " + scenario);
    Console.WriteLine("PASS: " + scenario);
    checks++;
}

// Читаем сырые метаданные, не загружая плагины и их зависимости.
var consumerPath = Output("Consumer", "Prototype.Consumer");
Check(ReadMetadata(consumerPath, "ThinkingHome.Plugin.ManifestVersion") == "1",
    "manifest read from PE metadata");
Check(ReadMetadata(consumerPath, "ThinkingHome.Plugin.EntryPoint.Prototype.Consumer.ConsumerPlugin") == "plugin"
    && ReadMetadata(consumerPath, "ThinkingHome.Plugin.Dependency.Prototype.PrivateLibrary") == "private",
    "entry point and dependency classification read without loading");
Check(!AssemblyLoadContext.All.SelectMany(x => x.Assemblies)
    .Any(x => x.GetName().Name == "Prototype.Consumer"), "metadata inspection does not load plugin");

// В прототипе реальный DatabasePlugin — явная общая зависимость в Default.
// Остальные плагины хост не использует как compile-time ссылки.
var shared = new Dictionary<string, Assembly>(StringComparer.OrdinalIgnoreCase);
void Share(Assembly assembly) => shared[assembly.GetName().Name!] = assembly;
Share(typeof(PluginBase).Assembly);
Share(typeof(DatabasePlugin).Assembly);
Share(typeof(DbContext).Assembly);
Share(typeof(DbModelBuilderAttribute).Assembly);
foreach (var assembly in AssemblyLoadContext.Default.Assemblies
    .Where(x => x.GetName().Name!.StartsWith("Microsoft.Extensions.", StringComparison.Ordinal))) Share(assembly);

var providerContext = new PluginContext("provider", shared, new() {
    ["Prototype.Provider"] = Output("Provider", "Prototype.Provider"),
    ["Prototype.PrivateLibrary"] = Output("PrivateV1", "Prototype.PrivateLibrary")
});
var providerAssembly = providerContext.LoadFromAssemblyName(new AssemblyName("Prototype.Provider"));
Share(providerAssembly);
var consumerContext = new PluginContext("consumer", shared, new() {
    ["Prototype.Consumer"] = consumerPath,
    ["Prototype.PrivateLibrary"] = Output("PrivateV2", "Prototype.PrivateLibrary")
});
var consumerAssembly = consumerContext.LoadFromAssemblyName(new AssemblyName("Prototype.Consumer"));
var providerType = providerAssembly.GetType("Prototype.Provider.ProviderPlugin", true)!;
var consumerType = consumerAssembly.GetType("Prototype.Consumer.ConsumerPlugin", true)!;

var registrations = new ServiceCollection();
registrations.AddSingleton<DatabasePlugin>();
registrations.AddSingleton(providerType);
registrations.AddSingleton(consumerType);
using var services = registrations.BuildServiceProvider();
var provider = services.GetRequiredService(providerType);
var consumer = (PluginBase)services.GetRequiredService(consumerType);
object? Invoke(object target, string method) => target.GetType().GetMethod(method)!.Invoke(target, null);

Check(ReferenceEquals(consumerType.GetProperty("Provider")!.GetValue(consumer), provider),
    "typed constructor dependency uses same provider instance");
Check(ReferenceEquals(services.GetRequiredService(consumerType), consumer), "consumer is singleton");
Check(ReferenceEquals(providerType.GetProperty("Database")!.GetValue(provider),
    services.GetRequiredService<DatabasePlugin>()), "real DatabasePlugin is shared through DI");
Check((string)Invoke(provider, "DescribePrivate")! == "private-v1", "provider uses private v1");
Check((string)Invoke(consumer, "DescribePrivate")! == "private-v2", "consumer uses private v2");
Check((string)Invoke(consumer, "DescribeProviderPrivate")! == "private-v1",
    "cross-plugin call retains provider private context");
Check(ReferenceEquals(consumerType.GetConstructors().Single().GetParameters()[0].ParameterType, providerType),
    "plugin type identity is preserved across contexts");

using (var session = (DbContext)Invoke(consumer, "OpenSession")!) {
    Check(session is HomeDbContext, "real EF DbContext crosses two plugin boundaries");
}
var handlers = consumer.FindMethods<DbModelBuilderAttribute, DbModelBuilderDelegate>().ToArray();
Check(handlers.Length == 1, "real attribute discovery finds custom-context handler");
var modelBuilder = new ModelBuilder();
handlers.Single().Method(modelBuilder);
Check(modelBuilder.Model.FindEntityType("PrototypeRecord") != null,
    "real delegate invokes handler with shared EF ModelBuilder");

var private1 = providerContext.Assemblies.Single(x => x.GetName().Name == "Prototype.PrivateLibrary");
var private2 = consumerContext.Assemblies.Single(x => x.GetName().Name == "Prototype.PrivateLibrary");
Check(private1.GetName().Version!.Major == 1 && private2.GetName().Version!.Major == 2
    && !ReferenceEquals(private1, private2), "same assembly name has two isolated versions");
Check(!ReferenceEquals(private1.GetType("Prototype.PrivateLibrary.Library"),
    private2.GetType("Prototype.PrivateLibrary.Library")), "private type identities differ");
Check(!AssemblyLoadContext.Default.Assemblies.Any(x => x.GetName().Name is
    "Prototype.Provider" or "Prototype.Consumer" or "Prototype.PrivateLibrary"),
    "host default context contains no fixture plugins or private dependencies");
Check(AssemblyLoadContext.All.SelectMany(x => x.Assemblies)
    .Count(x => x.GetName().Name == "Prototype.Provider") == 1, "provider assembly loaded only once");

try {
    consumerContext.LoadFromAssemblyName(new AssemblyName("Undeclared.Dependency"));
    throw new InvalidOperationException("Undeclared dependency unexpectedly loaded");
}
catch (FileNotFoundException) {
    Check(true, "undeclared dependency rejected");
}
Console.WriteLine($"Completed: {checks} checks; no database connection or plugin lifecycle started.");

static string? ReadMetadata(string path, string key) {
    using var stream = File.OpenRead(path);
    using var pe = new PEReader(stream);
    var reader = pe.GetMetadataReader();
    foreach (var handle in reader.GetAssemblyDefinition().GetCustomAttributes()) {
        var attribute = reader.GetCustomAttribute(handle);
        if (attribute.Constructor.Kind != HandleKind.MemberReference) continue;
        var constructor = reader.GetMemberReference((MemberReferenceHandle)attribute.Constructor);
        if (constructor.Parent.Kind != HandleKind.TypeReference) continue;
        var type = reader.GetTypeReference((TypeReferenceHandle)constructor.Parent);
        if (reader.GetString(type.Namespace) != "System.Reflection"
            || reader.GetString(type.Name) != "AssemblyMetadataAttribute") continue;
        var value = reader.GetBlobReader(attribute.Value);
        if (value.ReadUInt16() != 1) throw new BadImageFormatException("Invalid attribute prolog");
        if (value.ReadSerializedString() == key) return value.ReadSerializedString();
    }
    return null;
}

sealed class PluginContext(string name, IReadOnlyDictionary<string, Assembly> shared,
    Dictionary<string, string> files) : AssemblyLoadContext(name) {
    // Только runtime из установленного framework разрешён как неявный fallback.
    private static readonly HashSet<string> runtimeNames = ((string)AppContext.GetData("TRUSTED_PLATFORM_ASSEMBLIES")!)
        .Split(Path.PathSeparator)
        .Where(path => Path.GetDirectoryName(path) == Path.GetDirectoryName(typeof(object).Assembly.Location))
        .Select(path => Path.GetFileNameWithoutExtension(path))
        .ToHashSet(StringComparer.OrdinalIgnoreCase);

    protected override Assembly? Load(AssemblyName name) {
        if (shared.TryGetValue(name.Name!, out var assembly)) return assembly;
        if (files.TryGetValue(name.Name!, out var path)) return LoadFromAssemblyPath(path);
        if (runtimeNames.Contains(name.Name!)) return null;
        throw new FileNotFoundException($"Undeclared dependency {name} in {Name}");
    }
}
