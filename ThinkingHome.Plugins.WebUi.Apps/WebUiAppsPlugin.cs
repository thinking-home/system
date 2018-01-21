using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Localization;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi.Apps
{
    [JavaScriptResource("/static/web-ui/apps/common.js", "ThinkingHome.Plugins.WebUi.Apps.Resources.common.js")]
    [JavaScriptResource("/static/web-ui/apps/system.js", "ThinkingHome.Plugins.WebUi.Apps.Resources.system.js")]

    // templates
    [TemplateResource("/static/web-ui/apps/list.tpl", "ThinkingHome.Plugins.WebUi.Apps.Resources.list.tpl")]
    [TemplateResource("/static/web-ui/apps/list-item.tpl", "ThinkingHome.Plugins.WebUi.Apps.Resources.list-item.tpl")]

    // i18n
    [HttpLocalizationResource("/static/web-ui/apps/lang.json")]

    public class WebUiAppsPlugin : PluginBase
    {
        private class SectionInfo
        {
            public AppSectionAttribute Section { get; set; }
            public IStringLocalizer Localizer { get; set; }
        }

        private readonly List<SectionInfo> sections = new List<SectionInfo>();

        private IEnumerable<SectionInfo> GetPluginSections(PluginBase p)
        {
            var localizer = p.StringLocalizer;

            return p.GetType().GetTypeInfo()
                .GetCustomAttributes<AppSectionAttribute>()
                .Select(attr => new SectionInfo { Section = attr, Localizer = localizer});
        }

        public override void InitPlugin()
        {
            var list = Context.GetAllPlugins()
                .SelectMany(GetPluginSections)
                .OrderBy(s => s.Section.SortOrder);

            sections.AddRange(list);
        }


        #region web api

        [WebApiMethod("/api/web-ui/apps/user")]
        public object LoadUserSections(HttpRequestParams request)
        {
            return GetSectionList(SectionType.Common);
        }

        [WebApiMethod("/api/web-ui/apps/system")]
        public object LoadSystemSections(HttpRequestParams request)
        {
            return GetSectionList(SectionType.System);
        }

        private object GetSectionList(SectionType type)
        {
            return sections
                .Where(s => s.Section.Type == type)
                .Select(CreateSectionModel)
                .ToArray();
        }

        private object CreateSectionModel(SectionInfo info)
        {
            var section = info.Section;
            var localizer = info.Localizer;

            return new
            {
                title = localizer.GetString(section.Title).ToString(),
                icon = section.Icon,
                url = section.GetClientUrl()
            };
        }

        #endregion
    }
}