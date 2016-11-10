using System;
using System.Composition;

namespace ThinkingHome.Core.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public class PluginAttribute : ExportAttribute
    {
        public PluginAttribute() : base("9F1A88A2-4E69-4794-A5E2-98ACA829E204", typeof(PluginBase))
        {
        }
    }
}