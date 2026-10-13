using System.Reflection;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;

[assembly: AssemblyMetadata("ThinkingHome.Plugin.ManifestVersion", "1")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PackageId", "Prototype.Provider")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PackageVersion", "1.0.0")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PlatformRange", "[4.0.0-alpha34,5.0.0)")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.EntryPoint.Prototype.Provider.ProviderPlugin", "plugin")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.ThinkingHome.Plugins.Database", "plugin")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.Microsoft.EntityFrameworkCore", "shared")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.Prototype.PrivateLibrary", "private")]

namespace Prototype.Provider;

public class ProviderPlugin(DatabasePlugin database) : PluginBase {
    public DatabasePlugin Database => database;
    public DbContext OpenSession() => database.OpenSession();
    public string DescribePrivate() => PrivateLibrary.Library.Describe();
}
