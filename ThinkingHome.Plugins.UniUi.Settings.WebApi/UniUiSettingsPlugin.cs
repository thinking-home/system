using System;
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

        [WebApiMethod("/api/uniui/settings/web-api/dashboard/save")]
        public object CreateDashboard(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var title = request.GetRequiredString("title");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                Dashboard dashboard;

                if (id.HasValue)
                {
                    dashboard = session.Set<Dashboard>().Single(s => s.Id == id.Value);
                }
                else
                {
                    dashboard = new Dashboard { Id = Guid.NewGuid(), SortOrder = int.MaxValue };
                    session.Set<Dashboard>().Add(dashboard);
                }

                dashboard.Title = title;
                session.SaveChanges();

                return dashboard.Id;
            }
        }

        [WebApiMethod("/api/uniui/settings/web-api/dashboard/delete")]
        public object DeleteDashboard(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var dashboard = session.Set<Dashboard>().Single(s => s.Id == id);

                session.Set<Dashboard>().Remove(dashboard);
                session.SaveChanges();
            }

            return null;
        }
    }
}
