using System;
using System.Composition.Convention;
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

        /// <summary>
        /// Инициализация
        /// </summary>
        /// <param name="asms">Список сборок с плагинами - временное решение</param>
        public void Init(params Assembly[] asms)
        {
            try
            {
                LoadPlugins(asms);

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

        private void LoadPlugins(Assembly[] asms)
        {
            var conventions = new ConventionBuilder();
            conventions.ForTypesDerivedFrom<PluginBase>().Shared();



            var container = new ContainerConfiguration()
                .WithAssemblies(asms, conventions)
                .WithAssembly(GetType().GetTypeInfo().Assembly, conventions)
                .CreateContainer();

            context = container.GetExport<IServiceContext>("DCCEE19A-2CEA-423F-BFE5-AE5E12679938");
        }

        #endregion
    }
}