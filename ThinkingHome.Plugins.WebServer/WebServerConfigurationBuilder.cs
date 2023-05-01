using System;
using System.Reflection;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Messages;

namespace ThinkingHome.Plugins.WebServer;

public class WebServerConfigurationBuilder : BaseConfigurationBuilder<BaseHandler>
{
    private readonly ObjectSetRegistry<HubMessageHandlerDelegate> msgHandlers;

    public WebServerConfigurationBuilder(
        Type source,
        ObjectRegistry<BaseHandler> handlers,
        ObjectSetRegistry<HubMessageHandlerDelegate> msgHandlers) : base(source, handlers)
    {
        this.msgHandlers = msgHandlers;
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

    /// <summary>
    /// Зарегистрировать обработчик в шине сообщений
    /// </summary>
    public WebServerConfigurationBuilder RegisterMessageHandler(string topic, HubMessageHandlerDelegate method)
    {
        EnsureState();

        msgHandlers.Register(topic, method);

        return this;
    }
}
