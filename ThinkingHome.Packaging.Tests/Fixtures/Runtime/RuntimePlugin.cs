using System;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Timer;

namespace Fixture;

#if ENTRY_SHAPES
// Обнаружение учитывает наследование, видимость и закрытые generic-типы.
public abstract class AbstractPlugin : PluginBase { }
public class IndirectPlugin : AbstractPlugin { }
public class GenericPlugin<T> : PluginBase { }
public class ClosedPlugin : GenericPlugin<string> { }
internal class InternalPlugin : PluginBase { }
public class Container
{
    public class NestedPlugin : PluginBase { }
    private class PrivatePlugin : PluginBase { }
}
internal class HiddenContainer
{
    public class HiddenPlugin : PluginBase { }
}
#endif

public sealed class RuntimePlugin(TimerPlugin timer) : PluginBase
{
    public TimerPlugin Timer { get; } = timer;

    public static string Lifecycle { get; private set; } = "";

    public override void InitPlugin()
    {
        if (Timer.Context != Context)
        {
            throw new InvalidOperationException("DI did not share context");
        }

        Lifecycle += "init:" + Configuration["value"] + ";";
    }

    public override void StartPlugin()
    {
        Lifecycle += "start;";
    }

    public override void StopPlugin()
    {
        Lifecycle += "stop;";
    }

    [TimerCallback(60000)]
#if BAD_HANDLER
    public void Callback(string wrong) { }
#else
    public void Callback(DateTime now)
    {
    }
#endif
}
