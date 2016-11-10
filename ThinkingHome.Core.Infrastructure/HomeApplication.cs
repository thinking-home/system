using System;
using System.Collections.Generic;
using System.Composition.Convention;
using System.Composition.Hosting;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using NLog;
using ThinkingHome.Core.Infrastructure.Tmp;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Core.Infrastructure
{
    public class HomeApplication
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        private IServiceContext context;

        public void Init()
        {
            LoadPlugins();

            foreach (var plugin in context.GetAllPlugins())
            {
                plugin.InitPlugin();
            }
        }

        private void LoadPlugins()
        {
            var assembly = GetType().GetTypeInfo().Assembly;
            var assembly2 = typeof(PluginBase).GetTypeInfo().Assembly;
            var container = new ContainerConfiguration()
                .WithAssembly(assembly)
                .WithAssembly(assembly2)
                .CreateContainer();

            context = container.GetExport<IServiceContext>("DCCEE19A-2CEA-423F-BFE5-AE5E12679938");
        }
    }
}