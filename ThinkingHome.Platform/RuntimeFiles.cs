namespace ThinkingHome.Platform;

/// <summary>
/// Читает сведения, предоставленные хостом .NET для текущего процесса.
/// </summary>
public static class RuntimeFiles
{
    // Имена свойств принадлежат протоколу хоста .NET, а не конфигурации ThinkingHome.
    private const string TrustedAssemblies = "TRUSTED_PLATFORM_ASSEMBLIES";
    private const string ContextDependencies = "APP_CONTEXT_DEPS_FILES";

    /// <summary>Возвращает доступные процессу сборки, выбранные хостом .NET.</summary>
    public static string[] Assemblies() => Read(TrustedAssemblies, Path.PathSeparator);

    /// <summary>Возвращает стандартные deps.json, использованные при запуске процесса.</summary>
    public static string[] DependencyFiles() => Read(ContextDependencies, ';');

    private static string[] Read(string key, char separator)
    {
        if (AppContext.GetData(key) is not string value || string.IsNullOrWhiteSpace(value))
        {
            throw new NotSupportedException($"The .NET host does not provide {key}; use a regular framework-dependent deployment.");
        }

        return value.Split(separator, StringSplitOptions.RemoveEmptyEntries);
    }
}
