using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scripts.WebUi
{
    [AppSection(SectionType.System, "Scripts", "/static/scripts/web-ui/list.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list.js", Icon = "code")]
    [JavaScriptResource("/static/scripts/web-ui/editor.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.editor.js")]
    [HttpEmbeddedResource("/static/scripts/web-ui/editor.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.editor.tpl")]

    [AppSection(SectionType.System, "Script events", "/static/scripts/web-ui/subscriptions.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.subscriptions.js")]
    [HttpEmbeddedResource("/static/scripts/web-ui/subscriptions.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.subscriptions.tpl")]

    // vendor
    [JavaScriptResource("/vendor/js/codemirror.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.js", Alias = "codemirror")]
    [JavaScriptResource("/vendor/js/codemirror-javascript.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror-javascript.js", Alias = "codemirror-javascript")]
    [JavaScriptResource("/vendor/js/codemirror-fullscreen.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror-fullscreen.js", Alias = "codemirror-fullscreen")]
    [CssResource("/vendor/css/codemirror.css", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.css", AutoLoad = true)]
    public class ScriptsWebUiPlugin : PluginBase
    {
    }
}