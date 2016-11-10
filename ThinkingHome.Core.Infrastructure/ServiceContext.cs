using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Composition;
using System.Composition.Convention;
using ThinkingHome.Core.Plugins;
using System.Linq;

namespace ThinkingHome.Core.Infrastructure
{
    [Export("DCCEE19A-2CEA-423F-BFE5-AE5E12679938", typeof(IServiceContext)), Shared]
    public class ServiceContext : IServiceContext
    {
        [ImportingConstructor]
        public ServiceContext(
            [ImportMany("9F1A88A2-4E69-4794-A5E2-98ACA829E204")] IEnumerable<PluginBase> loadedPlugins)
        {
            plugins = loadedPlugins.ToDictionary(p => p.GetType());
        }

        #region plugins

        private readonly Dictionary<Type, PluginBase> plugins;

        public IReadOnlyCollection<PluginBase> GetAllPlugins()
        {
            return new ReadOnlyCollection<PluginBase>(plugins.Values.ToList());
        }

        public T GetPlugin<T>() where T : PluginBase
        {
            return plugins[typeof(T)] as T;
        }

        #endregion
    }
}