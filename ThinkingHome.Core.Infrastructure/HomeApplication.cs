using System;
using System.Collections.Generic;
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
        }

        private void LoadPlugins()
        {
            var assembly = GetType().GetTypeInfo().Assembly;
            var assembly2 = typeof(PluginBase).GetTypeInfo().Assembly;
            var container = new ContainerConfiguration()
                .WithAssembly(assembly)
                .WithAssembly(assembly2)
                .CreateContainer();

            context = container.GetExport<IServiceContext>();

            foreach (var pl in context.GetAllPlugins())
            {
                logger.Info(pl.GetType().FullName);
            }

            logger.Info("44444444");
            logger.Info(context.GetPlugin<TestPlugin2>().GetType());
        }
    }
}