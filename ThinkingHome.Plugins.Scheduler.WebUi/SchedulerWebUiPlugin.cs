using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scheduler.WebUi
{
    [AppSection(SectionType.System, "Scheduler", "/static/scheduler/web-ui/list.js",
        "ThinkingHome.Plugins.Scheduler.WebUi.Resources.list.js", Icon = "calendar-check-o", SortOrder = 30)]
    [JavaScriptResource("/static/scheduler/web-ui/editor.js", "ThinkingHome.Plugins.Scheduler.WebUi.Resources.editor.js")]
    [HttpEmbeddedResource("/static/scheduler/web-ui/editor.tpl", "ThinkingHome.Plugins.Scheduler.WebUi.Resources.editor.tpl")]
    public class SchedulerWebUiPlugin : PluginBase
    {
    }
}