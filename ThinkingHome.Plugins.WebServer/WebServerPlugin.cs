using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NLog.Extensions.Logging;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerPlugin : PluginBase
    {
        private IWebHost host;

        public override void InitPlugin(IConfigurationSection config)
        {
            var port = config.GetValue<int>("port", 41831);

            var loggerFactory = new LoggerFactory();
            loggerFactory.AddNLog();

            host = new WebHostBuilder()
                .UseLoggerFactory(loggerFactory)
                .UseKestrel()
                .UseUrls($"http://+:{port}")
                .Configure(Configure)
                .Build();
        }

        private void Configure(IApplicationBuilder app)
        {
            app.UseMiddleware<PluginApiMiddleware>();

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("<p>Hello World!<p>");
            });
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