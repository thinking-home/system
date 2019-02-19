using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;

namespace ThinkingHome.Core.Plugins
{
    public interface IServiceContext
    {
        IReadOnlyCollection<PluginBase> GetAllPlugins();
        IReadOnlyCollection<PluginBase> GetCorePlugins();

        T Require<T>() where T : PluginBase;
    }
}
