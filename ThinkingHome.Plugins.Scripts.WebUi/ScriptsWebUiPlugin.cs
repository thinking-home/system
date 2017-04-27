using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scripts.WebUi
{
    [AppSection(SectionType.System, "Scripts", "/static/scripts/web-ui/list.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list.js", Icon = "code")]
    [JavaScriptResource("/static/scripts/web-ui/editor.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.editor.js")]
    [CssResource("/static/scripts/web-ui/all.css", "ThinkingHome.Plugins.Scripts.WebUi.Resources.all.css", AutoLoad = true)]

    // vendor
    [JavaScriptResource("/vendor/js/codemirror.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.js", Alias = "codemirror")]
    [JavaScriptResource("/vendor/js/codemirror-javascript.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror-javascript.js", Alias = "codemirror-javascript")]
    [CssResource("/vendor/css/codemirror.css", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.css", AutoLoad = true)]
    public class ScriptsWebUiPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogCritical("scripts web ui inited");
        }
    }
}