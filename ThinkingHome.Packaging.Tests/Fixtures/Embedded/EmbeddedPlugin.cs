using ThinkingHome.Core.Plugins;

namespace Fixture;

public class EmbeddedPlugin : PluginBase {
    private Vendor.Dependency.Item item = new();
    public string Describe() => item.GetType().Name;
}
