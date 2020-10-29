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
using ThinkingHome.Plugins.WebServer.Attributes.Base;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Messages;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerPlugin : PluginBase
    {
        private IWebHost host;

        private IHubContext<MessageHub> hubContext;

        public override void InitPlugin()
        {
            var port = Configuration.GetValue("port", 41831);
            var handlers = RegisterHandlers();

            host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls($"http://+:{port}")
                .Configure(app => app
                    .UseRouting()
                    .UseEndpoints(routes =>
                    {
                        routes.MapHub<MessageHub>(MessageHub.HUB_ROUTE);
                    })
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

            var msgHandlers = RegisterMessageHandlers();
            hubContext = host.Services.GetService<IHubContext<MessageHub>>();

            MessageHub.Message += (id, timestamp, channel, data) =>
                SafeInvoke(msgHandlers[channel], fn => fn(id, timestamp, channel, data));
        }

        private ObjectRegistry<IHandler> RegisterHandlers()
        {
            var handlers = new ObjectRegistry<IHandler>();

            // api handlers
            Context.GetAllPlugins()
                .FindMethods<HttpDynamicResourceAttribute, HttpHandlerDelegate>()
                .ToObjectRegistry(handlers, mi => mi.Meta.Url, mi => new DynamicResourceHandler(mi.Method, mi.Meta));

            // resource handlers
            Context.GetAllPlugins()
                .FindAttrs<HttpStaticResourceAttribute>()
                .ToObjectRegistry(handlers, res => res.Meta.Url, res => new StaticResourceHandler(res.Type.Assembly, res.Meta));

            // localization handlers
            Context.GetAllPlugins()
                .FindAttrs<HttpLocalizationResourceAttribute>()
                .ToObjectRegistry(
                    handlers,
                    res => res.Meta.Url,
                    res => new LocalizationHandler(res.Meta, res.Plugin.StringLocalizer));

            handlers.ForEach((url, handler) => Logger.LogInformation($"register HTTP handler: \"{url}\""));

            return handlers;
        }

        private ObjectSetRegistry<HubMessageHandlerDelegate> RegisterMessageHandlers()
        {
            var messageHandlers = Context.GetAllPlugins()
                .FindMethods<HubMessageHandlerAttribute, HubMessageHandlerDelegate>()
                .ToObjectSetRegistry(mi => mi.Meta.Channel, mi => mi.Method);

            messageHandlers.ForEach((channel, handler) => Logger.LogInformation($"register hub message handler: \"{channel}\""));

            return messageHandlers;
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

        public Task Send(string channel, object data)
        {
            return hubContext.Send(channel, data);
        }
    }
}
