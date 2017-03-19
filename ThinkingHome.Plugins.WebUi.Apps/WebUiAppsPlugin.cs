using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi.Apps
{
    [JavaScriptResource("/webapp/apps.js", "ThinkingHome.Plugins.WebUi.Apps.Resources.apps.js")]
    public class WebUiAppsPlugin : PluginBase
    {
        private readonly List<AppSectionAttribute> sections = new List<AppSectionAttribute>();

        private IEnumerable<AppSectionAttribute> GetPluginSections(PluginBase p)
        {
            return p.GetType().GetTypeInfo().GetCustomAttributes<AppSectionAttribute>();
        }

        public override void InitPlugin()
        {
            var list = Context.GetAllPlugins()
                .SelectMany(GetPluginSections)
                .OrderBy(s => s.SortOrder);

            sections.AddRange(list);
        }

        [HttpCommand("/webapp/sections.json")]
        public object LoadParams(HttpRequestParams request)
        {
            return sections
                .Select(s => new
                {
                    title = s.Title,
                    url = s.GetClientUrl()
                })
                .ToArray();
        }

    }
}