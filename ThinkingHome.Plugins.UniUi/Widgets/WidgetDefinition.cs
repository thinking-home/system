using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.UniUi.Model;

namespace ThinkingHome.Plugins.UniUi.Widgets
{
    public abstract class WidgetDefinition
    {
        public IServiceContext Context { get; internal set; }

        public ILogger Logger { get; internal set; }

        public abstract string DisplayName { get; }

        public abstract object GetWidgetData(Widget widget, WidgetParameter[] parameters, DbContext session);

        public abstract WidgetParameterMetaData[] GetWidgetMetaData(DbContext session);
    }
}
