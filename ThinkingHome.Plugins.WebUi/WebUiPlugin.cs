using System.Globalization;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPlugin : PluginBase
{
    const string HTML_RES_PATH = "ThinkingHome.Plugins.WebUi.Resources.static.index.html";
    const string MIME_HTML = "text/html";
    const string MIME_JS = "application/javascript";
    const string MIME_CSS = "text/css";
    
    private readonly ObjectRegistry<WebUiPageDefinition> pages = new();
    
    [ConfigureWebServer]
    public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
    {
        RegisterPages(pages, Context);

        // TODO: подумать про пути к корневой странице + валидацию путей
        // TODO: подумать про локализацию — отдавать все переводы одним файлом
        // TODO: проверить, инициализируется ли один и тот же модуль несколько раз

        pages.ForEach((url, handler) => Logger.LogInformation("register web ui page: {Url}", url));

        config
            .RegisterEmbeddedResource("/", HTML_RES_PATH, MIME_HTML)
            .RegisterEmbeddedResource("/apps", HTML_RES_PATH, MIME_HTML)
            .RegisterEmbeddedResource("/settings", HTML_RES_PATH, MIME_HTML);

        foreach (var pageDef in pages.Data.Values) {
            config
                .RegisterEmbeddedResource(pageDef.PathDocument, HTML_RES_PATH, MIME_HTML)
                .RegisterEmbeddedResource(pageDef.PathJavaScript, pageDef.JsResourcePath, MIME_JS, pageDef.Source.Assembly);
        }
        
        config.RegisterEmbeddedResource(
            "/static/webui/css/bootstrap.min.css", 
            "ThinkingHome.Plugins.WebUi.Resources.static.bootstrap.min.css",
            MIME_CSS);

        config.RegisterEmbeddedResource(
            "/static/webui/js/vendor.js", 
            "ThinkingHome.Plugins.WebUi.Resources.app.vendor.js",
            MIME_JS);
        
        config.RegisterEmbeddedResource(
            "/static/webui/js/main.js", 
            "ThinkingHome.Plugins.WebUi.Resources.app.main.js",
            MIME_JS);

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

        var pages = this.pages.Data.Values.ToDictionary(
            p => p.PathDocument,
            p => new {
                js = p.PathJavaScript,
            });

        var config = new { lang };

        return HttpHandlerResult.Json(new { pages, config });
    }
}
