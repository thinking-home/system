using System.Reflection;
using Microsoft.Extensions.Configuration;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    // webapp
    [HttpEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.Application.index.html", "text/html")]
    [HttpEmbeddedResource("/favicon.ico", "ThinkingHome.Plugins.WebUi.Resources.Application.favicon.ico", "image/x-icon")]
    [JavaScriptResource("/webapp/index.js", "ThinkingHome.Plugins.WebUi.Resources.Application.index.js")]
    [JavaScriptResource("/webapp/lib.js", "ThinkingHome.Plugins.WebUi.Resources.Application.lib.js", Alias = "lib")]
    [JavaScriptResource("/webapp/core/app.js", "ThinkingHome.Plugins.WebUi.Resources.Application.core.app.js")]
    [JavaScriptResource("/webapp/core/router.js", "ThinkingHome.Plugins.WebUi.Resources.Application.core.router.js")]
    [JavaScriptResource("/webapp/core/layout.js", "ThinkingHome.Plugins.WebUi.Resources.Application.core.layout.js")]
    [HttpEmbeddedResource("/webapp/core/layout.tpl", "ThinkingHome.Plugins.WebUi.Resources.Application.core.layout.tpl")]

    // dummy
    [JavaScriptResource("/webapp/dummy.js", "ThinkingHome.Plugins.WebUi.Resources.Application.dummy.js")]
    [HttpEmbeddedResource("/webapp/dummy.tpl", "ThinkingHome.Plugins.WebUi.Resources.Application.dummy.tpl")]

    // css
    [CssResource("/webapp/index.css", "ThinkingHome.Plugins.WebUi.Resources.Application.index.css")]

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
    [JavaScriptResource("/vendor/js/backbone.radio.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.radio.min.js", Alias = "backbone.radio")]
    [JavaScriptResource("/vendor/js/marionette.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.marionette.min.js", Alias = "marionette")]
    [JavaScriptResource("/vendor/js/handlebars.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.handlebars.min.js", Alias = "handlebars")]
    [JavaScriptResource("/vendor/js/moment.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.moment.min.js", Alias = "moment")]
    public class WebUiPlugin : PluginBase
    {
        private readonly InternalDictionary<string> aliases = new InternalDictionary<string>();

        public override void InitPlugin()
        {
            aliases.Register("welcome", Configuration.GetValue("pages:welcome", "/webapp/dummy.js"));
            aliases.Register("apps", Configuration.GetValue("pages:apps", "/webapp/dummy.js"));
            aliases.Register("settings", Configuration.GetValue("pages:settings", "/webapp/dummy.js"));

            foreach (var plugin in Context.GetAllPlugins())
            {
                var type = plugin.GetType().GetTypeInfo();

                foreach (var jsinfo in type.GetCustomAttributes<JavaScriptResourceAttribute>())
                {
                    if (!string.IsNullOrEmpty(jsinfo.Alias))
                    {
                        aliases.Register(jsinfo.Alias, jsinfo.Url);
                    }
                }
            }
        }


        [HttpCommand("/webapp/config.json")]
        public object LoadParams(HttpRequestParams request)
        {
            return new
            {
                app = "mi mi mi",
                systemjs = new { map = aliases }
            };
        }
    }
}
