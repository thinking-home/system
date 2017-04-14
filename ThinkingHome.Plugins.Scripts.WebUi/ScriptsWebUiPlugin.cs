using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scripts.WebUi
{
    [AppSection(SectionType.System, "Scripts", "/webapp/scripts/list.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list.js", Icon = "code")]
    [CssResource("/webapp/scripts/index.css", "ThinkingHome.Plugins.Scripts.WebUi.Resources.index.css", AutoLoad = true)]
    public class ScriptsWebUiPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogCritical("scripts web ui inited");
        }
    }
}