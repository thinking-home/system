using System;

namespace ThinkingHome.Plugins.Scripts.Attributes
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ScriptCommandAttribute : Attribute
    {
        public string Alias { get; }

        public ScriptCommandAttribute(string alias)
        {
            Alias = alias;
        }
    }
}
