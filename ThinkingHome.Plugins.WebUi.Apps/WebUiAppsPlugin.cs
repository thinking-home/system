using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi.Apps
{
    [CssResource("/static/webui/apps/apps.css", "ThinkingHome.Plugins.WebUi.Apps.Resources.apps.css", AutoLoad = true)]
    [JavaScriptResource("/static/webui/apps.js", "ThinkingHome.Plugins.WebUi.Apps.Resources.apps.js")]
    [JavaScriptResource("/static/webui/settings.js", "ThinkingHome.Plugins.WebUi.Apps.Resources.settings.js")]
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


        #region web api

        [HttpJsonDynamicResource("/api/webui/apps/user")]
        public object LoadUserSections(HttpRequestParams request)
        {
            return GetSectionList(SectionType.User);
        }

        [HttpJsonDynamicResource("/api/webui/apps/system")]
        public object LoadSystemSections(HttpRequestParams request)
        {
            return GetSectionList(SectionType.System);
        }

        private object GetSectionList(SectionType type)
        {
            return sections
                .Where(s => s.Type == type)
                .Select(s => new
                {
                    title = s.Title,
                    icon = s.Icon,
                    url = s.GetClientUrl()
                })
                .ToArray();
        }

        #endregion
    }
}