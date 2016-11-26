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
        private readonly Dictionary<Type, PluginBase> plugins;

        [ImportingConstructor]
        public ServiceContext([ImportMany] IEnumerable<PluginBase> loadedPlugins)
        {
            plugins = loadedPlugins.ToDictionary(p => p.GetType());
        }

        public IReadOnlyCollection<PluginBase> GetAllPlugins()
        {
            return new ReadOnlyCollection<PluginBase>(plugins.Values.ToList());
        }

        public IReadOnlyCollection<T> GetAllPlugins<T>()
        {
            var filtered = plugins.Values.Where(obj => obj is T).Cast<T>();

            return new ReadOnlyCollection<T>(filtered.ToList());
        }

        public T Require<T>() where T : PluginBase
        {
            return plugins[typeof(T)] as T;
        }

        public void Using<T>(Action<T> action) where T : PluginBase
        {
            action(Require<T>());
        }
    }
}