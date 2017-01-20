using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Scripts.Model.Migrations
{
    [Migration(1)]
    public class Migration01 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("Scripts_UserScript",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("Name", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("Body", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull)
            );
        }

        public override void Revert()
        {
            Database.RemoveTable("Scripts_UserScript");
        }
    }
}