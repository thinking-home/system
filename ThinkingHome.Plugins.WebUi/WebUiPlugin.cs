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

    // vendor
    [JavaScriptResource("/vendor/js/system.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.system.min.js")]
    [JavaScriptResource("/vendor/js/system-json.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.system-json.min.js")]

    [JavaScriptResource("/vendor/js/json2.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.json2.min.js", Alias = "json2")]
    [JavaScriptResource("/vendor/js/jquery.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.jquery.min.js", Alias = "jquery")]
    [JavaScriptResource("/vendor/js/underscore.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.underscore.min.js", Alias = "underscore")]
    [JavaScriptResource("/vendor/js/backbone.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.min.js", Alias = "backbone")]
    [JavaScriptResource("/vendor/js/backbone.radio.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.radio.min.js", Alias = "backbone.radio")]
    [JavaScriptResource("/vendor/js/marionette.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.marionette.min.js", Alias = "marionette")]
    public class WebUiPlugin : PluginBase
    {
        private readonly InternalDictionary<string> aliases = new InternalDictionary<string>();

        public override void InitPlugin(IConfigurationSection config)
        {
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
