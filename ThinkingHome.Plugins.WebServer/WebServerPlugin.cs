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
            var loggerFactory = new LoggerFactory();
            loggerFactory.AddNLog();

            host = new WebHostBuilder()
                .UseLoggerFactory(loggerFactory)
                .UseUrls("http://+:41831")
                .UseStartup<Startup>()
                .Build();
        }

        public override void StartPlugin()
        {
            host.Start();
        }

        public override void StopPlugin()
        {
            host.Dispose();
        }
    }
}