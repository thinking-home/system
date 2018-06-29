using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.UniUi.Model;
using ThinkingHome.Plugins.UniUi.Widgets;

namespace ThinkingHome.Plugins.UniUi
{
    public class UniUiPlugin : PluginBase
    {
        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Dashboard>(cfg => cfg.ToTable("UniUi_Dashboard"));
            modelBuilder.Entity<Panel>(cfg => cfg.ToTable("UniUi_Panel"));
            modelBuilder.Entity<Widget>(cfg => cfg.ToTable("UniUi_Widget"));
            modelBuilder.Entity<WidgetParameter>(cfg => cfg.ToTable("UniUi_WidgetParameter"));
        }

        private WidgetDefinitionSet definitions;

        public IReadOnlyDictionary<string, WidgetDefinition> Definitions => definitions.Definitions;

        public override void InitPlugin()
        {
            definitions = new WidgetDefinitionSet(Context, Logger);

            var inits = Context.GetAllPlugins()
                .SelectMany(p => p.FindMethods<DefineWidgetsAttribute, DefineWidgetsDelegate>())
                .Select(obj => obj.Method)
                .ToArray();

            foreach (var fn in inits)
            {
                fn(definitions);
            }
        }
    }
}
