using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NLog.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Handlers.Api;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerPlugin : PluginBase
    {
        private IWebHost host;

        public override void InitPlugin(IConfigurationSection config)
        {
            var port = config.GetValue("port", 41831);
            var handlers = RegisterHandlers();

            host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls($"http://+:{port}")
                .Configure(app => app
                    .UseStatusCodePages()
                    .UseMiddleware<HomePluginsMiddleware>())
                .ConfigureServices(services => services
                    .AddSingleton(handlers)
                    .AddSingleton(Logger))
                .ConfigureLogging(loggerFactory =>
                    loggerFactory.AddNLog())
                .Build();
        }

        private HttpHandlerSet RegisterHandlers()
        {
            var handlers = new HttpHandlerSet();

            foreach (var plugin in Context.GetAllPlugins<IHttpApiOwner>())
            {
                var pluginTypeName = plugin.GetType().FullName;

                plugin.RegisterHandlers((url, method) =>
                {
                    Logger.Info($"register HTTP handler: [{pluginTypeName}]({url})");
                    handlers.Register(url, new ApiHttpHandler(method));
                });
            }

            foreach (var plugin in Context.GetAllPlugins())
            {
                var pluginTypeName = plugin.GetType().FullName;

                foreach (var mi in plugin.FindMethodsByAttribute<HttpCommandAttribute, HttpHandlerDelegate>())
                {
                    Logger.Info($"register HTTP handler: [{pluginTypeName}]({mi.MetaData.Url})");
                    handlers.Register(mi.MetaData.Url, new ApiHttpHandler(mi.Method));
                }
            }

            return handlers;
        }

        public override void StartPlugin()
        {
            // важно запускать Start вместо Run, чтобы оно не лезло напрямую в консоль
            host.Start();
        }

        public override void StopPlugin()
        {
            host.Dispose();
        }
    }
}
