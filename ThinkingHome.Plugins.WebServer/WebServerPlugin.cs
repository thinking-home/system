using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Messages;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerPlugin : PluginBase
    {
        private IWebHost host;

        private IHubContext<MessageHub> hubContext;

        private readonly ObjectRegistry<BaseHandler> handlers = new();
        private readonly ObjectSetRegistry<HubMessageHandlerDelegate> msgHandlers = new();

        public override void InitPlugin()
        {
            var port = Configuration.GetValue("port", 41831);

            RegisterHandlers(handlers, msgHandlers, Context);

            handlers.ForEach((url, _) => Logger.LogInformation("register HTTP handler: {Url}", url));
            msgHandlers.ForEach((topic, _) => Logger.LogInformation("register hub message handler: {Topic}", topic));


            host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls($"http://+:{port}")
                .Configure(app => app
                    .UseRouting()
                    .UseEndpoints(e => { e.MapHub<MessageHub>(MessageHub.HUB_ROUTE); })
                    .UseResponseCompression()
                    .UseStatusCodePages()
                    .UseMiddleware<HomePluginsMiddleware>(handlers))
                .ConfigureServices(services => services
                    .AddResponseCompression()
                    .AddMemoryCache()
                    .AddSignalR())
                .ConfigureLogging(builder =>
                    builder.AddProxy(Logger))
                .Build();

            hubContext = host.Services.GetService<IHubContext<MessageHub>>();

            MessageHub.Message += (id, timestamp, topic, data) => {
                Logger.LogInformation("message sent in topic {Topic} with id {Id}", topic, id);
                SafeInvoke(msgHandlers[topic], fn => fn(id, timestamp, topic, data));
            };
        }

        public IReadOnlyDictionary<string, BaseHandler> GetAllHandlers() => handlers.Data;

        private static void RegisterHandlers(
            ObjectRegistry<BaseHandler> handlers,
            ObjectSetRegistry<HubMessageHandlerDelegate> msgHandlers,
            IServiceContext context)
        {
            var inits = context.GetAllPlugins()
                .SelectMany(p => p.FindMethods<ConfigureWebServerAttribute, ConfigureWebServerDelegate>())
                .ToArray();

            foreach (var (_, fn, plugin) in inits) {
                using var configBuilder = new WebServerConfigurationBuilder(plugin.GetType(), handlers, msgHandlers);
                fn(configBuilder);
            }
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

        public Task Send(string topic, object data)
        {
            return hubContext.Send(topic, data);
        }
    }
}
