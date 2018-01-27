using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.UniUi.Model;

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
    }
}