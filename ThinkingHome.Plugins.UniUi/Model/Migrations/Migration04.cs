using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;
using ForeignKeyConstraint = ThinkingHome.Migrator.Framework.ForeignKeyConstraint;

namespace ThinkingHome.Plugins.UniUi.Model.Migrations
{
    [Migration(4)]
    public class Migration04 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("UniUi_WidgetParameter",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("WidgetId", DbType.Guid, ColumnProperty.NotNull),
                new Column("Name", DbType.String, ColumnProperty.NotNull),
                new Column("ValueGuid", DbType.Guid, ColumnProperty.Null),
                new Column("ValueString", DbType.String.WithSize(int.MaxValue), ColumnProperty.Null),
                new Column("ValueInt", DbType.Int32, ColumnProperty.Null)
            );

            Database.AddUniqueConstraint("UK_UniUi_WidgetParameter_WidgetId_Name",
                "UniUi_WidgetParameter", "Name", "WidgetId");

            Database.AddForeignKey("FK_UniUi_WidgetParameter_WidgetId",
                "UniUi_WidgetParameter", "WidgetId", "UniUi_Widget", "Id", ForeignKeyConstraint.Cascade);
        }

        public override void Revert()
        {
            Database.RemoveTable("UniUi_WidgetParameter");
        }
    }
}