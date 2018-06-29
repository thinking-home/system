using System.Data;
using ThinkingHome.Migrator.Framework;

namespace ThinkingHome.Plugins.UniUi.Model.MIgrations
{
    [Migration(1)]
    public class Migration01 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("UniUi_Dashboard",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("Title", DbType.String, ColumnProperty.NotNull),
                new Column("SortOrder", DbType.Int32, ColumnProperty.NotNull, 0)
            );
        }

        public override void Revert()
        {
            Database.RemoveTable("UniUi_Dashboard");
        }
    }
}