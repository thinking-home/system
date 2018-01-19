using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Cron.WebUi
{
    [AppSection(SectionType.System, "Cron tasks", "/static/cron/web-ui/list.js",
        "ThinkingHome.Plugins.Cron.WebUi.Resources.list.js", Icon = "clock-o")]
    [JavaScriptResource("/static/cron/web-ui/editor.js", "ThinkingHome.Plugins.Cron.WebUi.Resources.editor.js")]
    [HttpEmbeddedResource("/static/cron/web-ui/editor.tpl", "ThinkingHome.Plugins.Cron.WebUi.Resources.editor.tpl")]
    [CssResource("/static/cron/web-ui/styles.css", "ThinkingHome.Plugins.Cron.WebUi.Resources.styles.css", AutoLoad = true)]
    [HttpLocalizationResource("/static/cron/lang.json")]
    public class CronWebUiPlugin : PluginBase
    {
    }
}