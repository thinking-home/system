using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    // webapp
    [HttpEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.Application.index.html", "text/html")]
    [JavaScriptResource("/webapp/index.js", "ThinkingHome.Plugins.WebUi.Resources.Application.index.js")]
    [JavaScriptResource("/webapp/lib.js", "ThinkingHome.Plugins.WebUi.Resources.Application.lib.js")]
    [JavaScriptResource("/webapp/core/app.js", "ThinkingHome.Plugins.WebUi.Resources.Application.core.app.js")]

    // vendor
    [JavaScriptResource("/vendor/js/json2.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.json2.min.js")]
    [JavaScriptResource("/vendor/js/jquery.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.jquery.min.js")]
    [JavaScriptResource("/vendor/js/require.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.require.min.js")]
    [JavaScriptResource("/vendor/js/underscore.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.underscore.min.js")]
    [JavaScriptResource("/vendor/js/backbone.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.min.js")]
    [JavaScriptResource("/vendor/js/backbone.radio.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.radio.min.js")]
    [JavaScriptResource("/vendor/js/marionette.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.marionette.min.js")]
    // [HttpEmbeddedResource("/vendor/css/uikit.min.css", "ThinkingHome.Plugins.WebUi.Resources.Vendor.css.uikit.min.css", "text/css")]
    public class WebUiPlugin : PluginBase
    {
    }
}