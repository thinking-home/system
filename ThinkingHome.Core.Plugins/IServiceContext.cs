using System;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins
{
    public interface IServiceContext
    {
        IReadOnlyCollection<PluginBase> GetAllPlugins();

        T Require<T>() where T : PluginBase;

        void Using<T>(Action<T> action) where T : PluginBase;
    }
}