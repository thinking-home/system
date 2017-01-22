using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    // webapp
    [HttpEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.Application.index.html", "text/html")]
    [HttpEmbeddedResource("/webapp/index.js", "ThinkingHome.Plugins.WebUi.Resources.Application.index.js", "application/javascript")]

    // vendor
    [HttpEmbeddedResource("/vendor/js/json2.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.json2.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/jquery.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.jquery.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/require.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.require.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/underscore.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.underscore.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/backbone.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/backbone.radio.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.backbone.radio.min.js", "application/javascript")]
    [HttpEmbeddedResource("/vendor/js/marionette.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.marionette.min.js", "application/javascript")]
    // [HttpEmbeddedResource("/vendor/css/uikit.min.css", "ThinkingHome.Plugins.WebUi.Resources.Vendor.css.uikit.min.css", "text/css")]
    public class WebUiPlugin : PluginBase
    {
    }
}