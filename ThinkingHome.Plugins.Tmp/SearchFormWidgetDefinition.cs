using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Plugins.UniUi.Model;
using ThinkingHome.Plugins.UniUi.Widgets;

namespace ThinkingHome.Plugins.Tmp
{
    public class SearchFormWidgetDefinition : WidgetDefinition
    {
        public override string DisplayName => "Tmp search form";

        public override object GetWidgetData(Widget widget, WidgetParameter[] parameters, DbContext session)
        {
            var alias = widget.TypeAlias;
            var engine = parameters.Single(p => p.Name == "engine").ValueString;
            var count = parameters.Single(p => p.Name == "count").ValueInt;
            var suggest = new[] {"cat", "dog", "pig", "fish"};

            return new { alias, engine, count, suggest };
        }

        public override WidgetParameterMetaData[] GetWidgetMetaData(DbContext session)
        {
            var paramEngine = new WidgetParameterMetaData
            {
                DisplayName = "Search engine",
                Name = "engine",
                Type = WidgetParameterType.Int32,
                Items = new[] {
                    new WidgetSelectItem(1, "Yandex"),
                    new WidgetSelectItem(2, "Google")
                }
            };

            var paramCount = new WidgetParameterMetaData
            {
                DisplayName = "Search result count",
                Name = "count",
                Type = WidgetParameterType.Int32
            };

            return new[] { paramEngine, paramCount };
        }
    }
}
