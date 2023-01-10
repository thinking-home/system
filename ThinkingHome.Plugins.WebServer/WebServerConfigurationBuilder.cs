using System;
using System.Reflection;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer;

public class WebServerConfigurationBuilder: BaseConfigurationBuilder<BaseHandler>
{
    public WebServerConfigurationBuilder(Type source, ObjectRegistry<BaseHandler> handlers): base(source, handlers)
    {
    }

    /// <summary>
    /// Зарегистрировать статический HTTP ресурс (кэшируется)
    /// </summary>
    public WebServerConfigurationBuilder RegisterEmbeddedResource(
        string url, string resourcePath, string contentType = "text/plain", Assembly assembly = null)
    {
        RegisterItem(url, new StaticResourceHandler(Source, resourcePath, contentType, assembly));

        return this;
    }
    
    /// <summary>
    /// Зарегистрировать динамический HTTP ресурс (опционально кэшируется)
    /// </summary>
    public WebServerConfigurationBuilder RegisterDynamicResource(
        string url, HttpHandlerDelegate method, bool isCached = false)
    {
        RegisterItem(url, new DynamicResourceHandler(Source, method, isCached));
        
        return this;
    }
}
