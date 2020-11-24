using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer;

namespace ThinkingHome.Plugins.WebUi
{
    public class WebUiPlugin: PluginBase, IWillUseWebServer
    {
        public void RegisterHttpHandlers(WebServerConfigBuilder cfg)
        {
            // pages
            cfg.RegisterStaticHandler("/", "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html");
            cfg.RegisterStaticHandler("/moo", "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html");
            cfg.RegisterStaticHandler("/test", "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html");

            // favicons
            cfg.RegisterStaticHandler("/favicon.ico", "ThinkingHome.Plugins.WebUi.Resources.favicon.ico", "image/x-icon");
            cfg.RegisterStaticHandler("/favicon-16x16.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-16x16.png", "image/png");
            cfg.RegisterStaticHandler("/favicon-32x32.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-32x32.png", "image/png");
        }
    }
}
