using System.Globalization;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPlugin: PluginBase
{
    private readonly ObjectRegistry<WebUiPageDefinition> pages = new();

    [ConfigureWebServer]
    public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
    {
        RegisterPages(pages, Context);
        
        // TODO: подумать про пути к css и пути к корневой странице + валидацию путей
        // TODO: подумать про локализацию — отдавать все переводы одним файлом
        // TODO: сделать генерацию путей к модулям на основе адреса или содержимого
        // TODO: проверить, инициализируется ли один и тот же модуль несколько раз

        pages.ForEach((url, handler) => Logger.LogInformation("register web ui page: {Url}", url));

        config.RegisterEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.static.index.html", "text/html");
        
        foreach (var pageDef in pages.Data) {
            config.RegisterEmbeddedResource(pageDef.Key, "ThinkingHome.Plugins.WebUi.Resources.static.index.html", "text/html");
            config.RegisterEmbeddedResource(pageDef.Value.JsPath, pageDef.Value.ResourcePath, "application/javascript", pageDef.Value.Source.Assembly);
        }

        config.RegisterEmbeddedResource("/static/webui/js/react.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.react.production.min.js", "application/javascript");
        config.RegisterEmbeddedResource("/static/webui/js/react-dom.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.react-dom.production.min.js", "application/javascript");
        config.RegisterEmbeddedResource("/static/webui/js/history.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.history.production.min.js", "application/javascript");
        config.RegisterEmbeddedResource("/static/webui/js/react-router.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.react-router.production.min.js", "application/javascript");
        config.RegisterEmbeddedResource("/static/webui/js/react-router-dom.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.react-router-dom.production.min.js", "application/javascript");
        
        config.RegisterEmbeddedResource("/static/webui/css/bootstrap.min.css", "ThinkingHome.Plugins.WebUi.Resources.static.bootstrap.min.css", "text/css");

        config.RegisterEmbeddedResource("/static/webui/js/main.js", "ThinkingHome.Plugins.WebUi.Resources.app.main.js", "application/javascript");

        config.RegisterDynamicResource("/api/webui/meta", GetMeta);
    }

    private static void RegisterPages(ObjectRegistry<WebUiPageDefinition> pages, IServiceContext context)
    {
        var inits = context.GetAllPlugins()
            .SelectMany(p => p.FindMethods<ConfigureWebUiAttribute, ConfigureWebUiDelegate>())
            .ToArray();

        foreach (var (meta, fn, plugin) in inits) {
            using var configBuilder = new WebUiConfigurationBuilder(plugin.GetType(), pages);
            fn(configBuilder);
        }
    }

    private HttpHandlerResult GetMeta(HttpRequestParams requestParams)
    {
        var lang = CultureInfo.CurrentCulture.Name;
        
        var pages = this.pages.Data.Select(p => new {
            route = p.Key,
            js = p.Value.JsPath,
            title = p.Value.Title
        }).ToArray();

        var config = new { lang };

        return HttpHandlerResult.Json(new { pages, config });
    }
}
