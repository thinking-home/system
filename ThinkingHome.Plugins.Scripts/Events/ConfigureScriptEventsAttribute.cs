using System;

namespace ThinkingHome.Plugins.Scripts.Events
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ConfigureScriptEventsAttribute : Attribute { }

    public delegate void ConfigureScriptEventsDelegate(ScriptEventsConfigurationBuilder config);
}
