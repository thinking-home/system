using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Reflection;
using System.Text;
using Microsoft.Extensions.Configuration;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebServer.Messages;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    // webapp
    [HttpEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html")]
    [HttpEmbeddedResource("/favicon.ico", "ThinkingHome.Plugins.WebUi.Resources.favicon.ico", "image/x-icon")]

    [JavaScriptResource("/static/web-ui/index.js", "ThinkingHome.Plugins.WebUi.Resources.Application.index.js")]
    [JavaScriptResource("/static/web-ui/lib.js", "ThinkingHome.Plugins.WebUi.Resources.Application.lib.js", Alias = "lib")]
    [JavaScriptResource("/static/web-ui/application.js", "ThinkingHome.Plugins.WebUi.Resources.Application.application.js")]
    [JavaScriptResource("/static/web-ui/router.js", "ThinkingHome.Plugins.WebUi.Resources.Application.router.js")]
    [JavaScriptResource("/static/web-ui/radio.js", "ThinkingHome.Plugins.WebUi.Resources.Application.radio.js")]
    [JavaScriptResource("/static/web-ui/errors.js", "ThinkingHome.Plugins.WebUi.Resources.Application.errors.js")]
    [JavaScriptResource("/static/web-ui/layout.js", "ThinkingHome.Plugins.WebUi.Resources.Application.layout.js")]
    [HttpEmbeddedResource("/static/web-ui/layout.tpl", "ThinkingHome.Plugins.WebUi.Resources.Application.layout.tpl")]

    // loaders
    [JavaScriptResource("/static/web-ui/loaders/system-lang.js", "ThinkingHome.Plugins.WebUi.Resources.Application.loaders.system-lang.js", Alias = "lang")]

    // dummy
    [JavaScriptResource("/static/web-ui/dummy.js", "ThinkingHome.Plugins.WebUi.Resources.Application.dummy.js")]
    [HttpEmbeddedResource("/static/web-ui/dummy.tpl", "ThinkingHome.Plugins.WebUi.Resources.Application.dummy.tpl")]

    // css
    [CssResource("/static/web-ui/index.css", "ThinkingHome.Plugins.WebUi.Resources.Application.index.css", AutoLoad = true)]

    // vendor

    // systemjs
    [JavaScriptResource("/vendor/js/system.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.system.min.js")]
    [JavaScriptResource("/vendor/js/system-json.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.system-json.min.js")]
    [JavaScriptResource("/vendor/js/system-text.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.system-text.min.js")]

    // bootstrap
    [CssResource("/vendor/css/bootstrap.css", "ThinkingHome.Plugins.WebUi.Resources.Vendor.css.bootstrap.min.css")]

    // font awesome
    [CssResource("/vendor/css/font-awesome.css", "ThinkingHome.Plugins.WebUi.Resources.Vendor.css.font-awesome.min.css")]
    [HttpEmbeddedResource("/vendor/fonts/fontawesome-webfont.eot", "ThinkingHome.Plugins.WebUi.Resources.Vendor.fonts.fontawesome-webfont.eot", "application/vnd.ms-fontobject")]
    [HttpEmbeddedResource("/vendor/fonts/fontawesome-webfont.svg", "ThinkingHome.Plugins.WebUi.Resources.Vendor.fonts.fontawesome-webfont.svg", "image/svg+xml")]
    [HttpEmbeddedResource("/vendor/fonts/fontawesome-webfont.ttf", "ThinkingHome.Plugins.WebUi.Resources.Vendor.fonts.fontawesome-webfont.ttf", "application/x-font-truetype")]
    [HttpEmbeddedResource("/vendor/fonts/fontawesome-webfont.woff", "ThinkingHome.Plugins.WebUi.Resources.Vendor.fonts.fontawesome-webfont.woff", "application/font-woff")]
    [HttpEmbeddedResource("/vendor/fonts/fontawesome-webfont.woff2", "ThinkingHome.Plugins.WebUi.Resources.Vendor.fonts.fontawesome-webfont.woff2", "application/font-woff2")]

    // libraries
    [JavaScriptResource("/vendor/js/jquery.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.jquery.min.js", Alias = "jquery")]
    [JavaScriptResource("/vendor/js/underscore.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.underscore.min.js", Alias = "underscore")]
    [JavaScriptResource("/vendor/js/backbone.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.min.js", Alias = "backbone")]
    [JavaScriptResource("/vendor/js/backbone.syphon.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.syphon.min.js", Alias = "syphon")]
    [JavaScriptResource("/vendor/js/backbone.radio.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.radio.min.js", Alias = "backbone.radio")]
    [JavaScriptResource("/vendor/js/marionette.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.marionette.min.js", Alias = "marionette")]
    [JavaScriptResource("/vendor/js/handlebars.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.handlebars.min.js", Alias = "handlebars")]
    [JavaScriptResource("/vendor/js/moment.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.moment.min.js", Alias = "moment")]
    [JavaScriptResource("/vendor/js/signalr-client.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.signalr-client.min.js", Alias = "signalr-client")]
    public class WebUiPlugin : PluginBase
    {
        private readonly ObjectRegistry<string> aliases = new ObjectRegistry<string>();
        private readonly HashSet<string> alautoLoadedStyles = new HashSet<string>();

        public override void InitPlugin()
        {
            aliases.Register("welcome", Configuration.GetValue("pages:welcome", "/static/web-ui/dummy.js"));
            aliases.Register("apps", Configuration.GetValue("pages:apps", "/static/web-ui/dummy.js"));
            aliases.Register("settings", Configuration.GetValue("pages:settings", "/static/web-ui/dummy.js"));

            Context.GetAllPlugins()
                .FindAttrs<JavaScriptResourceAttribute>(a => !string.IsNullOrEmpty(a.Alias))
                .ToObjectRegistry(aliases, a => a.Meta.Alias, a => a.Meta.Url);

            foreach (var cssinfo in Context.GetAllPlugins().FindAttrs<CssResourceAttribute>(a => a.AutoLoad))
            {
                alautoLoadedStyles.Add(cssinfo.Meta.Url);
            }
        }

        [HttpTextDynamicResource("/dynamic/web-ui/imports.css", "text/css")]
        public object LoadCssImports(HttpRequestParams request)
        {
            var sb = new StringBuilder();

            foreach (var url in alautoLoadedStyles.Select(url => Uri.EscapeUriString(url).ToJson()))
            {
                sb.AppendLine($"@import url({url});");
            }

            return sb;
        }


        [HttpJsonDynamicResource("/dynamic/web-ui/config.json")]
        public object LoadParams(HttpRequestParams request)
        {
            return new
            {
                app = new
                {
                    radio = new
                    {
                        route = MessageHub.HUB_ROUTE,
                        clientMethod = MessageHub.CLIENT_METHOD_NAME,
                        serverMethod = MessageHub.SERVER_METHOD_NAME,
                        reconnectionTimeout = MessageHub.RECONNECTION_TIMEOUT
                    }
                },
                systemjs = new { map = aliases.Data }
            };
        }
    }
}
