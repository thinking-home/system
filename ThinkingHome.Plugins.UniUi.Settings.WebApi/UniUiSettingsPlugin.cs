using System.Linq;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.UniUi.Model;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.UniUi.Settings.WebApi
{
    public class UniUiSettingsPlugin : PluginBase
    {
        private object ToDashboardApiModel(Dashboard dashboard)
        {
            return new
            {
                id = dashboard.Id,
                title = dashboard.Title,
                sortOrder = dashboard.SortOrder
            };
        }

        [WebApiMethod("/api/uniui/settings/web-api/dashboard/list")]
        public object GetDashboardList(HttpRequestParams request)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var list = session.Set<Dashboard>()
                    .OrderBy(d => d.SortOrder)
                    .Select(ToDashboardApiModel)
                    .ToArray();

                return list;
            }
        }
    }
}