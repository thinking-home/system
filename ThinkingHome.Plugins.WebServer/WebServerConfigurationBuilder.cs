using System;
using System.Reflection;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer;

public class WebServerConfigurationBuilder: IDisposable
{
    private bool disposed;
    private readonly ObjectRegistry<BaseHandler> handlers;

    public WebServerConfigurationBuilder(ObjectRegistry<BaseHandler> handlers)
    {
        this.handlers = handlers;
    }

    public void Dispose()
    {
        disposed = true;
    }

    private void EnsureState()
    {
        if (disposed) {
            throw new InvalidOperationException("Can't add handler into disposed registry");
        }
    }

    /// <summary>
    /// Зарегистрировать статический HTTP ресурс (кэшируется)
    /// </summary>
    public WebServerConfigurationBuilder RegisterEmbeddedResource(
        string url, string resourcePath, Assembly assembly, string contentType = "text/plain")
    {
        EnsureState();
        
        handlers.Register(url, new StaticResourceHandler(resourcePath, contentType, assembly));
        return this;
    }
    
    /// <summary>
    /// Зарегистрировать динамический HTTP ресурс (опционально кэшируется)
    /// </summary>
    public WebServerConfigurationBuilder RegisterDynamicResource(
        string url, HttpHandlerDelegate method, bool isCached = false)
    {
        EnsureState();
        
        handlers.Register(url, new DynamicResourceHandler(method, isCached));
        return this;
    }
}
