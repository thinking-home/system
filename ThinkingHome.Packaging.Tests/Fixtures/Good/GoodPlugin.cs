using System;
using System.Runtime.CompilerServices;
using ThinkingHome.Core.Plugins;

namespace Fixture;

#if NO_ENTRY_POINTS
public abstract class GoodPlugin : PluginBase {
#else
public class GoodPlugin : PluginBase
{
#endif
    private Vendor.Dependency.Item item = new();
    public Envelope GetData() => new();
}

public class Envelope
{
    public Envelope Next { get; set; }
    public string Text { get; set; }
}

internal static class ExecutionTrap
{
    [ModuleInitializer]
    internal static void Initialize() => throw new InvalidOperationException("PLUGIN CODE MUST NOT EXECUTE");
}
