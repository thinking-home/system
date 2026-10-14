using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;
using ThinkingHome.Core.Plugins;
using ILogger = Microsoft.Extensions.Logging.ILogger;

namespace ThinkingHome.Core.Infrastructure
{
    /// <summary>
    /// Управляет контейнером сервисов и жизненным циклом выбранных плагинов.
    /// </summary>
    public class HomeApplication
    {
        private readonly List<PluginBase> initialized = new();
        private UnhandledExceptionEventHandler unhandled;
        private EventHandler<UnobservedTaskExceptionEventArgs> unobserved;
        private IServiceProvider services;
        private ILogger logger;
        private IServiceContext context;

        /// <summary>
        /// Создаёт сервисы, инициализирует все плагины и затем запускает их в порядке зависимостей.
        /// </summary>
        /// <param name="config">Настройки приложения и плагинов.</param>
        /// <param name="pluginTypes">Проверенные загрузчиком точки входа в порядке зависимостей.</param>
        public void StartServices(HomeConfiguration config, IReadOnlyList<Type> pluginTypes)
        {
            ArgumentNullException.ThrowIfNull(pluginTypes);

            services = ConfigureServices(config, pluginTypes);
            var loggerFactory = services.GetRequiredService<ILoggerFactory>().AddSerilog(config.LoggerConfiguration.CreateLogger(), true);
            logger = loggerFactory.CreateLogger<HomeApplication>();
            context = services.GetRequiredService<IServiceContext>();

            // без этой подписки процесс при фатальной ошибке умирает без записи в лог
            unhandled = (s, e) => logger.LogCritical(e.ExceptionObject as Exception, "unhandled exception");
            AppDomain.CurrentDomain.UnhandledException += unhandled;

            // ошибки задач, завершения которых никто не ждет (fire-and-forget), иначе теряются
            unobserved = (s, e) =>
            {
                logger.LogError(e.Exception, "unobserved task exception");
                e.SetObserved();
            };

            TaskScheduler.UnobservedTaskException += unobserved;
            InitLanguage(config);

            try
            {
                // init plugins
                foreach (var plugin in context.GetAllPlugins())
                {
                    logger.LogInformation("init plugin: {Plugin}", plugin.GetType().FullName);
                    // Учитываем плагин до вызова: даже частичная инициализация требует остановки.
                    initialized.Add(plugin);
                    plugin.InitPlugin();
                }

                // start plugins
                foreach (var plugin in context.GetAllPlugins())
                {
                    logger.LogInformation("start plugin {Plugin}", plugin.GetType().FullName);
                    plugin.StartPlugin();
                }

                logger.LogInformation("all plugins are started");
            }
            catch (ReflectionTypeLoadException ex)
            {
                logger.LogError(0, ex, "error on plugins initialization");

                foreach (var loaderException in ex.LoaderExceptions)
                {
                    logger.LogError(0, loaderException, loaderException?.Message);
                }

                throw;
            }
            catch (Exception ex)
            {
                logger.LogError(0, ex, "error on start plugins");
                throw;
            }
        }

        /// <summary>
        /// Останавливает инициализированные плагины в обратном порядке и освобождает сервисы.
        /// </summary>
        public void StopServices()
        {
            foreach (var plugin in initialized.AsEnumerable().Reverse())
            {
                try
                {
                    logger.LogInformation("stop plugin {Plugin}", plugin.GetType().FullName);
                    plugin.StopPlugin();
                }
                catch (Exception ex)
                {
                    logger.LogError(0, ex, "error on stop plugins");
                }
            }

            initialized.Clear();
            logger?.LogInformation("all plugins are stopped");


            // Глобальные события не должны удерживать сервисы и контексты плагинов после остановки.
            if (unhandled != null)
            {
                AppDomain.CurrentDomain.UnhandledException -= unhandled;
            }

            if (unobserved != null)
            {
                TaskScheduler.UnobservedTaskException -= unobserved;
            }


            (services as IDisposable)?.Dispose();
            services = null;
            context = null;
            logger = null;
        }

        #region private
        private void InitLanguage(HomeConfiguration config)
        {
            var culture = config.GetCulture();
            logger.LogInformation("init culture: {Culture}", culture);
            Thread.CurrentThread.CurrentCulture = Thread.CurrentThread.CurrentUICulture = CultureInfo.DefaultThreadCurrentCulture = CultureInfo.DefaultThreadCurrentUICulture = culture;
        }

        private static IServiceProvider ConfigureServices(HomeConfiguration config, IReadOnlyList<Type> pluginTypes)
        {
            var serviceCollection = new ServiceCollection();
            serviceCollection.AddOptions();
            serviceCollection.AddSingleton<ILoggerFactory, LoggerFactory>();
            serviceCollection.AddSingleton<IServiceContext, ServiceContext>();
            serviceCollection.AddSingleton<IConfigurationSection>(config.Configuration.GetSection("plugins"));

            serviceCollection.AddLocalization(opts => opts.ResourcesPath = "Lang");

            // Регистрируем только точки входа из проверенного плана, без сканирования сборок.
            foreach (var pluginType in pluginTypes)
            {
                if (pluginType.IsAbstract || !typeof(PluginBase).IsAssignableFrom(pluginType))
                {
                    throw new InvalidOperationException("Invalid plugin type: " + pluginType);
                }

                serviceCollection.AddSingleton(pluginType);
                serviceCollection.AddSingleton(typeof(PluginBase), x => x.GetRequiredService(pluginType));
            }

            return serviceCollection.BuildServiceProvider();
        }
        #endregion
    }
}
