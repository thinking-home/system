using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Platform;

/// <summary>
/// Определяет платформу по выбранному runtime и графу зависимостей ядра.
/// </summary>
/// <remarks>Хост и менеджер поставляются вместе с одинаковыми runtime и платформенными сборками.</remarks>
public static class HostPlatform
{
    /// <summary>
    /// Переносимый RID текущего процесса для выбора и проверки пакетов.
    /// </summary>
    public static string CurrentRid => TargetRid(RuntimeInformation.RuntimeIdentifier,
        OperatingSystem.IsLinux(), RuntimeInformation.ProcessArchitecture);

    /// <summary>
    /// Создаёт каталог фактических сборок платформы без ручного перечня пакетов.
    /// </summary>
    public static PlatformCatalog Current()
    {
        var core = typeof(PluginBase).Assembly;
        var coreName = core.GetName().Name!;
        var version = core.GetCustomAttribute<AssemblyInformationalVersionAttribute>()!.InformationalVersion.Split('+')[0];
        var paths = RuntimeFiles.Assemblies().Distinct(StringComparer.OrdinalIgnoreCase)
            .ToDictionary(path => Path.GetFileNameWithoutExtension(path)!, StringComparer.OrdinalIgnoreCase);
        var bcl = DependencyGraph.FrameworkAssemblies(Path.GetDirectoryName(typeof(object).Assembly.Location)!);
        var aspnet = DependencyGraph.FrameworkAssemblies(Path.GetDirectoryName(typeof(HttpContext).Assembly.Location)!);

        // Общие frameworks уже предоставлены процессом. Частные зависимости инструментов сюда не входят.
        var selected = paths.Where(pair => bcl.Contains(pair.Key) || aspnet.Contains(pair.Key))
            .Select(pair => pair.Value).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var versions = selected.ToDictionary(path => Path.GetFileNameWithoutExtension(path)!,
            path => ReadFrameworkVersion(path, bcl.Contains(Path.GetFileNameWithoutExtension(path))
                ? typeof(object).Assembly : typeof(HttpContext).Assembly),
            StringComparer.OrdinalIgnoreCase);

        // deps.json учитывает PackageReference, включая транзитивные зависимости и отличающиеся имена DLL.
        var dependencies = DependencyGraph.Read(RuntimeFiles.DependencyFiles(), coreName, versions.Keys, paths.Keys);
        foreach (var dependency in dependencies)
        {
            foreach (var asset in dependency.Assemblies)
            {
                var name = Path.GetFileNameWithoutExtension(asset);
                if (!paths.TryGetValue(name, out var path))
                {
                    throw new InvalidDataException($"Platform dependency assembly is unavailable: {dependency.Id} -> {asset}");
                }

                selected.Add(path);
            }

            versions[dependency.Id] = dependency.Version;
        }

        selected.Add(core.Location);
        versions[coreName] = version;
        var rid = CurrentRid;
        return new(version, "net10.0", rid, versions,
            selected.Order(StringComparer.Ordinal).ToArray());
    }

    // Дистрибутивная сборка .NET может сообщать ubuntu.24.04-x64 вместо переносимого linux-x64.
    // musl/Bionic и другие архитектуры не становятся поддерживаемыми за счёт нормализации.
    internal static string TargetRid(string runtimeIdentifier, bool isLinux, Architecture architecture)
    {
        if (isLinux && architecture == Architecture.X64
            && !runtimeIdentifier.Contains("musl", StringComparison.Ordinal)
            && !runtimeIdentifier.Contains("bionic", StringComparison.Ordinal)
            && !runtimeIdentifier.StartsWith("alpine", StringComparison.Ordinal))
            return "linux-x64";

        return runtimeIdentifier;
    }

    private static string ReadFrameworkVersion(string path, Assembly framework)
    {
        var version = FileVersionInfo.GetVersionInfo(path).ProductVersion;
        if (string.IsNullOrWhiteSpace(version))
        {
            // Ресурсные сборки framework могут не иметь собственного атрибута версии продукта.
            version = framework.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
                ?? throw new InvalidDataException("Framework has no informational version: " + framework.FullName);
        }

        return version.Split('+')[0];
    }
}
