using System.Reflection;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer
{
    public class WebServerConfigBuilder
    {
        private readonly Assembly assembly;
        private readonly ObjectRegistry<BaseHandler> registry;

        public WebServerConfigBuilder(ObjectRegistry<BaseHandler> registry, Assembly assembly)
        {
            this.registry = registry;
            this.assembly = assembly;
        }

        public WebServerConfigBuilder RegisterDynamicHandler(string url, HttpHandlerDelegate method, bool isCached)
        {
            registry.Register(url, new DynamicResourceHandler(method, isCached));
            return this;
        }

        public WebServerConfigBuilder RegisterStaticHandler(string url, string resourcePath, string contentType)
        {
            registry.Register(url, new StaticResourceHandler(resourcePath, contentType, assembly));
            return this;
        }

        public WebServerConfigBuilder RegisterHandler(string url, BaseHandler handler)
        {
            registry.Register(url, handler);
            return this;
        }
    }
}
