using System;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer;

namespace ThinkingHome.Plugins.WebUi
{
    public class WebUiPlugin: PluginBase, IWillUseWebServer
    {
        public class TestModel
        {
            public string msg;
            public Guid guid = Guid.NewGuid();
        }

        protected TestModel GetRootData()
        {
            return new TestModel { msg = "root" };
        }

        protected TestModel GetMooData()
        {
            return new TestModel { msg = "moo" };
        }

        protected TestModel GetTestData()
        {
            return new TestModel { msg = "test" };
        }

        public void RegisterHttpHandlers(WebServerConfigBuilder cfg)
        {
            // pages
            // cfg.RegisterStaticHandler("/", "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html");
            cfg.RegisterWebPage("/", GetRootData);
            cfg.RegisterWebPage("/moo", GetMooData);
            cfg.RegisterWebPage("/test", GetTestData);

            // favicons
            cfg.RegisterStaticHandler("/favicon.ico", "ThinkingHome.Plugins.WebUi.Resources.favicon.ico", "image/x-icon");
            cfg.RegisterStaticHandler("/favicon-16x16.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-16x16.png", "image/png");
            cfg.RegisterStaticHandler("/favicon-32x32.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-32x32.png", "image/png");
        }
    }
}
