using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Prototype.Provider;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;

[assembly: AssemblyMetadata("ThinkingHome.Plugin.ManifestVersion", "1")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PackageId", "Prototype.Consumer")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PackageVersion", "1.0.0")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.PlatformRange", "[4.0.0-alpha34,5.0.0)")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.EntryPoint.Prototype.Consumer.ConsumerPlugin", "plugin")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.Prototype.Provider", "plugin")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.ThinkingHome.Plugins.Database", "plugin")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.Microsoft.EntityFrameworkCore", "shared")]
[assembly: AssemblyMetadata("ThinkingHome.Plugin.Dependency.Prototype.PrivateLibrary", "private")]

namespace Prototype.Consumer;

public class ConsumerPlugin(ProviderPlugin provider) : PluginBase {
    public ProviderPlugin Provider => provider;
    public string DescribePrivate() => PrivateLibrary.Library.Describe();
    public string DescribeProviderPrivate() => provider.DescribePrivate();
    public DbContext OpenSession() => provider.OpenSession();

    [DbModelBuilder]
    public void ConfigureModel(ModelBuilder builder) {
        builder.Entity("PrototypeRecord").Property<int>("Id");
    }
}
