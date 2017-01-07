using System.Threading;
using Microsoft.AspNetCore.Hosting;
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
                .UseStartup<Startup>()
                .Build();
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