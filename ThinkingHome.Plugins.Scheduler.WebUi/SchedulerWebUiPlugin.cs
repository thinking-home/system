using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebUi.Apps;

namespace ThinkingHome.Plugins.Scheduler.WebUi
{
    [AppSection(SectionType.System, "Scheduler", "/static/scheduler/web-ui/list.js",
        "ThinkingHome.Plugins.Scheduler.WebUi.Resources.list.js", Icon = "calendar-check-o")]
    public class SchedulerWebUiPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogInformation("mimi");
        }
    }
}