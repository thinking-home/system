using ThinkingHome.Core.Plugins;

namespace Fixture;

public class TransitivePlugin : PluginBase {
#if THROUGH_PLUGIN
    public Vendor.Dependency.Item GetData() => null;
#else
    public Contract.Payload GetData() => null;
#endif
}
