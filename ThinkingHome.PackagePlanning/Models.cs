using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ThinkingHome.PackagePlanning;

public sealed record RootPlugin(string Id, string Version);
public sealed record PlanRequest(string Framework, string Rid, RootPlugin[] Plugins);
// Каталог задаёт поставщик хоста; пути нужны только для локальной проверки и не попадают в lock-файл.
public sealed record PlatformCatalog(string Version, string Framework, string Rid,
    Dictionary<string, string> Packages, string[] Assemblies);
public sealed record LockedPlatform(string Version, SortedDictionary<string, string> Packages, PlatformAssembly[] Assemblies);
public sealed record PlatformAssembly(string Identity, string Sha512);
public sealed record LockedFile(string Path, string Sha512);
public sealed record LockedPackage(string Key, string Id, string Version, string Kind, string Source, string Sha512, LockedFile[] Files);
public sealed record LockedEdge(string From, string To, string Id, string Range, string Kind);
public sealed record LockedNode(string Key, string Scope, string Package, string[] EntryPoints);
public sealed record PluginLock(int FormatVersion, string Framework, string Rid, RootPlugin[] Roots,
    LockedPlatform Platform, LockedPackage[] Packages, LockedNode[] Nodes, LockedEdge[] Dependencies, string[] PluginOrder);
public sealed record LoadAsset(string Scope, string Owner, string Kind, string Name, string? Identity,
    string? Package, string? Path, string Sha512, string? Culture = null);
public sealed record LoadMap(int FormatVersion, string Framework, string Rid, string LockSha512, LoadAsset[] Assets);
public sealed record InstallationPlan(PluginLock Lock, LoadMap LoadMap);

public sealed class ResolutionException(string message) : Exception(message);

public static class PlanJson {
    public static JsonSerializerOptions Options { get; } = new() {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
    };

    public static T Read<T>(string path) => JsonSerializer.Deserialize<T>(File.ReadAllBytes(path), Options)
        ?? throw new InvalidDataException("Empty document: " + path);
    public static byte[] Bytes<T>(T value) => JsonSerializer.SerializeToUtf8Bytes(value, Options);
    public static string Hash(byte[] bytes) => Convert.ToHexString(SHA512.HashData(bytes));
}
