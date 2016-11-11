using System;
using System.Composition.Hosting;
using System.Reflection;
using NLog;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Core.Infrastructure
{
    public class HomeApplication
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        private IServiceContext context;

        public void Init()
        {
            try
            {
                LoadPlugins();

                // инициализируем плагины
                foreach (var plugin in context.GetAllPlugins())
                {
                    logger.Info("init plugin: {0}", plugin.GetType().FullName);
                    plugin.InitPlugin();
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex, "error on plugins initialization");
                throw;
            }
        }

        public void StartServices()
        {
            try
            {
                foreach (var plugin in context.GetAllPlugins())
                {
                    logger.Info("start plugin {0}", plugin.GetType().FullName);
                    plugin.StartPlugin();
                }

                logger.Info("all plugins are started");
            }
            catch (Exception ex)
            {
                logger.Error(ex, "error on start plugins");
                throw;
            }
        }

        public void StopServices()
        {
            foreach (var plugin in context.GetAllPlugins())
            {
                try
                {
                    logger.Info("stop plugin {0}", plugin.GetType().FullName);
                    plugin.StopPlugin();
                }
                catch (Exception ex)
                {
                    logger.Error(ex, "error on stop plugins");
                }
            }

            logger.Info("all plugins are stopped");
        }

        #region private

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

        #endregion
    }
}