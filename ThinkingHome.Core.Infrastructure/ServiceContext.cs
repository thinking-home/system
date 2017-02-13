using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Composition;
using ThinkingHome.Core.Plugins;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ThinkingHome.Core.Infrastructure
{
    public class ServiceContext : IServiceContext
    {
        private readonly Dictionary<Type, PluginBase> plugins;

        public ServiceContext(
            IEnumerable<PluginBase> loadedPlugins,
            IConfigurationSection configuration,
            ILoggerFactory loggerFactory)
        {
            plugins = loadedPlugins.ToDictionary(p => p.GetType());

            foreach (var plugin in plugins.Values)
            {
                var type = plugin.GetType();

                plugin.Context = this;
                plugin.Logger = loggerFactory.CreateLogger(type);
                plugin.Configuration = configuration.GetSection(type.FullName);
            }
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