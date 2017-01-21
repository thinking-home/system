using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    // webapp
    [HttpEmbeddedResource("/", "ThinkingHome.Plugins.WebUi.Resources.Application.index.html", "text/html")]
    [HttpEmbeddedResource("/webapp/index.js", "ThinkingHome.Plugins.WebUi.Resources.Application.index.js", "application/javascript")]

    // vendor
    [HttpEmbeddedResource("/vendor/js/require.js", "ThinkingHome.Plugins.WebUi.Resources.Vendor.js.require.js", "application/javascript")]
    // [HttpEmbeddedResource("/vendor/css/uikit.min.css", "ThinkingHome.Plugins.WebUi.Resources.Vendor.css.uikit.min.css", "text/css")]
    public class WebUiPlugin : PluginBase
    {
    }
}