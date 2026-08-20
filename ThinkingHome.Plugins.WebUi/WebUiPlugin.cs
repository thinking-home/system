using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Resources;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Messages;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPlugin : PluginBase {
    const string HTML_RES_PATH = "ThinkingHome.Plugins.WebUi.Resources.static.index.html";
    const string MIME_HTML = "text/html;charset=utf-8";
    const string MIME_JS = "application/javascript";
    const string MIME_CSS = "text/css";

    // The shared ESM libraries (react, react-router, @thinking-home/ui, …) ship
    // prebuilt inside @thinking-home/ui and are copied into Resources/app/vendor
    // by the client build. shared.json maps each bare specifier to its file.
    const string VENDOR_MANIFEST_RES = "ThinkingHome.Plugins.WebUi.Resources.app.vendor.shared.json";
    const string VENDOR_RES_PREFIX = "ThinkingHome.Plugins.WebUi.Resources.app.vendor.";
    const string VENDOR_URL_PREFIX = "/static/webui/vendor/";
    const string IMPORTMAP_PLACEHOLDER = "<!--th:importmap-->";

    // Клиент веб-интерфейса и его предсжатые копии, созданные сборкой.
    static readonly StaticResource MAIN_BUNDLE = new(
        "ThinkingHome.Plugins.WebUi.Resources.app.main.js",
        "ThinkingHome.Plugins.WebUi.Resources.app.main.js.gz",
        "ThinkingHome.Plugins.WebUi.Resources.app.main.js.br");

    private readonly ObjectRegistry<WebUiPageDefinition> pages = new();
    private readonly ObjectRegistry<IStringLocalizer> localizers = new();

    [ConfigureWebServer]
    public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
    {
        RegisterPages(pages, localizers, Context);

        // TODO: подумать про пути к корневой странице + валидацию путей

        pages.ForEach((url, handler) =>
            Logger.LogInformation("register web ui page: {Url} (lang id: {LangId})", url, handler.LangId));

        // Build the host document once: registers the vendor modules and injects
        // the import map so the browser can resolve their bare specifiers.
        var indexDocument = BuildIndexDocument(config);
        HttpHandlerResult ServeIndex(HttpRequestParams _) => indexDocument;

        config.RegisterDynamicResource("/", ServeIndex, true);

        foreach (var pageDef in pages.Data.Values) {
            config.RegisterDynamicResource(pageDef.PathDocument, ServeIndex, true);

            config.RegisterEmbeddedResource(pageDef.PathJavaScript, pageDef.Js, MIME_JS, pageDef.Source.Assembly);
        }

        config.RegisterEmbeddedResource(
            "/static/webui/css/bootstrap.min.css",
            "ThinkingHome.Plugins.WebUi.Resources.static.bootstrap.min.css",
            MIME_CSS);

        config.RegisterEmbeddedResource("/static/webui/js/main.js", MAIN_BUNDLE, MIME_JS);

        config.RegisterDynamicResource("/api/webui/meta", GetMeta);
        config.RegisterDynamicResource("/api/webui/lang", GetLang, true);
    }

    private HttpHandlerResult BuildIndexDocument(WebServerConfigurationBuilder config)
    {
        // shared.json: манифест, который сборка th-ui генерирует вместе с бандлами.
        // imports — соответствие импортов файлам, files — сжатые варианты каждого файла.
        // Имена файлов берём только отсюда: собирать их самостоятельно нельзя, иначе
        // схема имён дублируется в двух репозиториях и может разъехаться.
        var manifest = JsonSerializer.Deserialize<StaticManifest>(ReadTextResource(VENDOR_MANIFEST_RES))
            ?? throw new InvalidDataException($"invalid vendor manifest: {VENDOR_MANIFEST_RES}");

        // register each vendor module for serving (deduplicated by file name)
        foreach (var fileName in manifest.Imports.Values.Distinct()) {
            // манифест перечисляет варианты, созданные при сборке: если заявленного
            // варианта нет в ресурсах, это ошибка сборки, а не повод отдать несжатый файл
            var files = manifest.Files[fileName];

            Logger.LogInformation("register vendor module: {File}", fileName);

            config.RegisterEmbeddedResource(
                VENDOR_URL_PREFIX + fileName,
                new StaticResource(
                    VENDOR_RES_PREFIX + fileName,
                    VENDOR_RES_PREFIX + files["gzip"],
                    VENDOR_RES_PREFIX + files["br"]),
                MIME_JS);
        }

        // build the import map { imports: { specifier: url } } and inject it
        var imports = manifest.Imports.ToDictionary(pair => pair.Key, pair => VENDOR_URL_PREFIX + pair.Value);
        var importMap = $"<script type=\"importmap\">{new { imports }.ToJson()}</script>";

        var html = ReadTextResource(HTML_RES_PATH).Replace(IMPORTMAP_PLACEHOLDER, importMap);

        return HttpHandlerResult.Binary(Encoding.UTF8.GetBytes(html), MIME_HTML);
    }

    private string ReadTextResource(string resourcePath)
    {
        using var stream = GetType().Assembly.GetManifestResourceStream(resourcePath);

        if (stream == null) {
            throw new MissingManifestResourceException($"resource {resourcePath} is not found");
        }

        using var reader = new StreamReader(stream, Encoding.UTF8);
        return reader.ReadToEnd();
    }

    private static void RegisterPages(ObjectRegistry<WebUiPageDefinition> pages, ObjectRegistry<IStringLocalizer> localizers, IServiceContext context)
    {
        var inits = context.GetAllPlugins()
            .SelectMany(p => p.FindMethods<ConfigureWebUiAttribute, ConfigureWebUiDelegate>())
            .ToArray();

        foreach (var (meta, fn, plugin) in inits) {
            var source = plugin.GetType();
            var localizerId = source.ToString().GetHashString();

            using var configBuilder = new WebUiConfigurationBuilder(source, localizerId, pages);
            fn(configBuilder);

            if (configBuilder.HasPages) {
                localizers.Register(localizerId, plugin.StringLocalizer);
            }
        }
    }

    private HttpHandlerResult GetLang(HttpRequestParams requestParams)
    {
        var id = requestParams.GetRequiredString("id");

        if (!localizers.ContainsKey(id)) {
            throw new HttpHandlerException(StatusCode.BadRequest, "localizer not found");
        }

        var stringLocalizer = localizers[id];
        var values = stringLocalizer
            .GetAllStrings()
            .ToDictionary(str => str.Name, str => str.Value);

        return HttpHandlerResult.Json(values);
    }

    private HttpHandlerResult GetMeta(HttpRequestParams requestParams)
    {
        var lang = CultureInfo.CurrentCulture.Name;

        var pages = this.pages.Data.Values.ToDictionary(
            p => p.PathDocument,
            p => new {
                js = p.PathJavaScript,
                langId = p.LangId,
            });

        var messageHub = new {
            route = $"/{MessageHub.HUB_ROUTE}",
            clientMethod = MessageHub.CLIENT_METHOD_NAME,
            serverMethod = MessageHub.SERVER_METHOD_NAME,
            reconnectionTimeout = MessageHub.RECONNECTION_TIMEOUT_MS,
        };

        var config = new { lang, messageHub };

        return HttpHandlerResult.Json(new { pages, config });
    }
}
