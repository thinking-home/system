using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    [HttpEmbeddedResource("/favicon.ico", "ThinkingHome.Plugins.WebUi.Resources.favicon.ico", "image/x-icon")]
    [HttpEmbeddedResource("/static/web-ui/favicon-16x16.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-16x16.png", "image/png")]
    [HttpEmbeddedResource("/static/web-ui/favicon-32x32.png", "ThinkingHome.Plugins.WebUi.Resources.favicon-32x32.png", "image/png")]
    [HttpEmbeddedResource("/static/web-ui/react.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.js.react.production.min.js", "application/javascript;charset=utf-8")]
    [HttpEmbeddedResource("/static/web-ui/react-dom.production.min.js", "ThinkingHome.Plugins.WebUi.Resources.static.js.react-dom.production.min.js", "application/javascript;charset=utf-8")]
    public class WebUiPlugin : PluginBase
    {
    }
}
