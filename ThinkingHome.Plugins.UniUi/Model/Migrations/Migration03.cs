using System.Data;
using ThinkingHome.Migrator.Framework;
using ForeignKeyConstraint = ThinkingHome.Migrator.Framework.ForeignKeyConstraint;

namespace ThinkingHome.Plugins.UniUi.Model.Migrations
{
    [Migration(3)]
    public class Migration03 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("UniUi_Widget",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("PanelId", DbType.Guid, ColumnProperty.NotNull),
                new Column("TypeAlias", DbType.String, ColumnProperty.NotNull),
                new Column("DisplayName", DbType.String, ColumnProperty.NotNull),
                new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0)
            );

            Database.AddForeignKey("FK_UniUi_Widget_PanelId",
                "UniUi_Widget", "PanelId", "UniUi_Panel", "Id", ForeignKeyConstraint.Cascade);
        }

        public override void Revert()
        {
            Database.RemoveTable("UniUi_Widget");
        }
    }
}