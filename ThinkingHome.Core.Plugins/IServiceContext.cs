using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins
{
    public interface IServiceContext
    {
        IReadOnlyCollection<PluginBase> GetAllPlugins();

        T GetPlugin<T>() where T : PluginBase;
    }
}