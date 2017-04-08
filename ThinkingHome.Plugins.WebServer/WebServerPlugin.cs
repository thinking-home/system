using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerPlugin : PluginBase
    {
        private IWebHost host;

        public override void InitPlugin()
        {
            var port = Configuration.GetValue("port", 41831);
            var handlers = RegisterHandlers();

            host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls($"http://+:{port}")
                .Configure(app => app
                    .UseStatusCodePages()
                    .UseMiddleware<HomePluginsMiddleware>(handlers))
                .ConfigureServices(services => services
                    .AddMemoryCache())
                .ConfigureLogging(loggerFactory =>
                    loggerFactory.AddProxy(Logger))
                .Build();
        }

        private InternalDictionary<IHttpHandler> RegisterHandlers()
        {
            var handlers = new InternalDictionary<IHttpHandler>();

            foreach (var plugin in Context.GetAllPlugins())
            {
                var pluginType = plugin.GetType();

                // api handlers
                foreach (var mi in plugin.FindMethodsByAttribute<HttpCommandAttribute, HttpHandlerDelegate>())
                {
                    Logger.LogInformation($"register HTTP handler: \"{mi.MetaData.Url}\" ({pluginType.FullName})");
                    handlers.Register(mi.MetaData.Url, new ApiHttpHandler(mi.Method));
                }

                // resource handlers
                var asm = pluginType.GetTypeInfo().Assembly;

                foreach (var resource in pluginType.GetTypeInfo().GetCustomAttributes<HttpResourceAttribute>())
                {
                    Logger.LogInformation($"register HTTP handler: \"{resource.Url}\" ({resource.GetType().FullName})");
                    handlers.Register(resource.Url, new ResourceHttpHandler(asm, resource));
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
