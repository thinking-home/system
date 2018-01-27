using System.Data;
using ThinkingHome.Migrator.Framework;
using ForeignKeyConstraint = ThinkingHome.Migrator.Framework.ForeignKeyConstraint;

namespace ThinkingHome.Plugins.UniUi.Model.Migrations
{
    [Migration(2)]
    public class Migration02 : Migration
	{
		public override void Apply()
		{
            Database.AddTable("UniUi_Panel",
				new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
				new Column("DashboardId", DbType.Guid, ColumnProperty.NotNull),
				new Column("Title", DbType.String, ColumnProperty.NotNull),
				new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0)
			);

            Database.AddForeignKey("FK_UniUi_Panel_DashboardId",
                "UniUi_Panel", "DashboardId", "UniUi_Dashboard", "Id", ForeignKeyConstraint.Cascade);
		}

		public override void Revert()
		{
            Database.RemoveTable("UniUi_Panel");
		}
	}
}
