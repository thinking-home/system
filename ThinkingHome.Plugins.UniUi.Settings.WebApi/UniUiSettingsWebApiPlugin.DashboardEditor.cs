using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.UniUi.Model;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.UniUi.Settings.WebApi
{
    public partial class UniUiSettingsWebApiPlugin
    {
        /// <summary>
        /// Список панелей и виджетов для редактора
        /// </summary>
        [WebApiMethod("/api/uniui/settings/web-api/panel/list")]
        public object GetPanelList(HttpRequestParams request)
        {
            var dashboardId = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var info = GetDashboardModel(dashboardId, session);
                var panels = GetPanelListModel(dashboardId, session);

                return new { info, panels };
            }
        }

        #region private

        private object GetDashboardModel(Guid dashboardId, DbContext session)
        {
            var dashboard = session.Set<Dashboard>().Single(x => x.Id == dashboardId);

//            var types = defs
//                .Select(x => new { id = x.Key, name = x.Value.DisplayName })
//                .ToArray();

            var model = new
            {
                id = dashboard.Id,
                title = dashboard.Title
//                types
            };

            return model;
        }

        private object GetPanelListModel(Guid dashboardId, DbContext session)
        {
            var allWidgets = session.Set<Widget>()
                .Include(p => p.Panel)
                .Where(w => w.Panel.Dashboard.Id == dashboardId)
                .ToArray();

            var allPanels = session.Set<Panel>()
                .Where(w => w.Dashboard.Id == dashboardId)
                .ToArray()
                .Select(p => GetPanelModel(p, allWidgets))
                .ToArray();

            return allPanels;
        }

        private object GetPanelModel(Panel panel, Widget[] allWidgets)
        {
            var widgets = allWidgets
                .Where(w => w.Panel.Id == panel.Id)
                .Select(GetWidgetModel)
                .ToArray();

            var model = new {
                id = panel.Id,
                title = panel.Title,
                widgets = widgets.ToArray(),
                sortOrder = panel.SortOrder
            };

            return model;
        }

        private object GetWidgetModel(Widget widget)
        {
//            var typeDisplayName = defs.ContainsKey(widget.TypeAlias)
//                ? defs[widget.TypeAlias].DisplayName
//                : string.Format("[{0}]", widget.TypeAlias);

            var typeDisplayName = $"Widget[{widget.TypeAlias}]";

            var displayName = string.IsNullOrEmpty(widget.DisplayName) ? "[no name]" : widget.DisplayName;

            var widgetModel = new
            {
                id = widget.Id,
                type = widget.TypeAlias,
                sortOrder = widget.SortOrder,
                displayName,
                typeDisplayName
            };

            return widgetModel;
        }

        #endregion
    }
}