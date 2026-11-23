namespace ThinkingHome.Platform;

/// <summary>
/// Каталог поставщика хоста. Локальные пути сборок используются для проверки и не сохраняются в lock-файле.
/// </summary>
public sealed record PlatformCatalog(string Version, string Framework, string Rid, Dictionary<string, string> Packages,
    string[] Assemblies);
