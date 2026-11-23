using System.Reflection;

namespace ThinkingHome.Packaging;

/// <summary>
/// Обнаруживает точки входа в основной сборке плагина по единому правилу.
/// </summary>
public static class PluginEntryPoints
{
    /// <summary>
    /// Возвращает публичные конкретные наследники PluginBase без открытых generic-параметров.
    /// </summary>
    /// <param name="assembly">Основная сборка плагина, загруженная в MetadataLoadContext.</param>
    /// <remarks>Не создаёт экземпляры и не выполняет код плагина. Зависимости не сканируются.</remarks>
    public static string[] Discover(Assembly assembly)
    {
        var entries = assembly.GetTypes()
            .Where(type => type.IsClass && type.IsVisible && !type.IsAbstract
                && !type.ContainsGenericParameters && IsPlugin(type))
            .Select(type => type.FullName!)
            .Order(StringComparer.Ordinal).ToArray();

        PluginManifest.Require(entries.Length > 0, "No plugin entry points: " + assembly.GetName().Name);
        return entries;
    }

    private static bool IsPlugin(Type type)
    {
        for (var parent = type.BaseType; parent != null; parent = parent.BaseType)
        {
            if (parent.FullName == "ThinkingHome.Core.Plugins.PluginBase"
                && parent.Assembly.GetName().Name == "ThinkingHome.Core.Plugins")
            {
                return true;
            }
        }

        return false;
    }
}
