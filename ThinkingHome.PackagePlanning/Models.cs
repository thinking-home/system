using System.Security.Cryptography;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ThinkingHome.PackagePlanning;

/// <summary>
/// Запрошенный корневой плагин и допустимый диапазон его версий.
/// </summary>
public sealed record RootPlugin(string Id, string Version);

/// <summary>
/// Целевая платформа и корневые плагины, для которых требуется построить план.
/// </summary>
public sealed record PlanRequest(string Framework, string Rid, RootPlugin[] Plugins);

/// <summary>
/// Зафиксированные версия платформы, версии её пакетов и контрольные суммы сборок.
/// </summary>
public sealed record LockedPlatform(string Version, SortedDictionary<string, string> Packages, PlatformAssembly[] Assemblies);

/// <summary>
/// Полная идентичность платформенной сборки и SHA-512 её содержимого.
/// </summary>
public sealed record PlatformAssembly(string Identity, string Sha512);

/// <summary>
/// Относительный путь файла внутри пакета и SHA-512 его содержимого.
/// </summary>
public sealed record LockedFile(string Path, string Sha512);

/// <summary>
/// Зафиксированный пакет: источник, версия, SHA-512 архива и проверенные файлы.
/// </summary>
public sealed record LockedPackage(string Key, string Id, string Version, string Kind, string Source, string Sha512, LockedFile[] Files);

/// <summary>
/// Ребро графа с диапазоном версии и видом зависимости между узлами.
/// </summary>
public sealed record LockedEdge(string From, string To, string Id, string Range, string Kind);

/// <summary>
/// Узел графа, его область зависимостей, пакет и автоматически обнаруженные точки входа плагина.
/// </summary>
public sealed record LockedNode(string Key, string Scope, string Package, string[] EntryPoints);

/// <summary>
/// Воспроизводимый граф установки с точными пакетами, платформой и порядком плагинов.
/// </summary>
public sealed record PluginLock(int FormatVersion, string Framework, string Rid, RootPlugin[] Roots, LockedPlatform Platform,
    LockedPackage[] Packages, LockedNode[] Nodes, LockedEdge[] Dependencies, string[] PluginOrder);

/// <summary>
/// Файл карты загрузки: вид, идентичность, контрольная сумма, область видимости и владелец контекста.
/// </summary>
/// <param name="Scope">Область, из которой разрешено запрашивать файл.</param>
/// <param name="Owner">Контекст, владеющий загруженной сборкой: platform, shared или узел плагина.</param>
/// <param name="Kind">Вид файла: managed, resource или native.</param>
/// <param name="Name">Имя, используемое при разрешении библиотеки.</param>
/// <param name="Identity">Полная идентичность управляемой сборки; null для нативного файла.</param>
/// <param name="Package">Ключ пакета; null для файла платформы.</param>
/// <param name="Path">Относительный путь внутри пакета; null для файла платформы.</param>
/// <param name="Sha512">Контрольная сумма выбранного файла.</param>
/// <param name="Culture">Культура спутниковой сборки ресурсов, если применимо.</param>
public sealed record LoadAsset(string Scope, string Owner, string Kind, string Name, string? Identity, string? Package,
    string? Path, string Sha512, string? Culture = null);

/// <summary>
/// Карта разрешения библиотек, привязанная контрольной суммой к конкретному lock-файлу.
/// </summary>
public sealed record LoadMap(int FormatVersion, string Framework, string Rid, string LockSha512, LoadAsset[] Assets);

/// <summary>
/// Согласованная пара lock-файла и карты загрузки.
/// </summary>
public sealed record InstallationPlan(PluginLock Lock, LoadMap LoadMap);

/// <summary>
/// Ошибка совместимости или разрешения графа зависимостей.
/// </summary>
public sealed class ResolutionException(string message) : Exception(message);

/// <summary>
/// Единые правила чтения, сериализации и вычисления контрольных сумм документов планирования.
/// </summary>
public static class PlanJson
{
    /// <summary>
    /// Настройки JSON с camelCase, нечувствительным к регистру чтением имён и запретом неизвестных полей.
    /// </summary>
    public static JsonSerializerOptions Options { get; } = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow
    };

    /// <summary>
    /// Читает JSON-документ из UTF-8-файла, в том числе с BOM; пустой документ считается ошибкой.
    /// </summary>
    public static T Read<T>(string path) => JsonSerializer.Deserialize<T>(File.ReadAllText(path),
        Options) ?? throw new InvalidDataException("Empty document: " + path);

    /// <summary>
    /// Сериализует значение в UTF-8 с едиными настройками документов планирования.
    /// </summary>
    public static byte[] Bytes<T>(T value) => JsonSerializer.SerializeToUtf8Bytes(value, Options);

    /// <summary>
    /// Вычисляет SHA-512 и возвращает шестнадцатеричную строку в верхнем регистре.
    /// </summary>
    public static string Hash(byte[] bytes) => Convert.ToHexString(SHA512.HashData(bytes));
}
