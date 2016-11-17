using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Tmp.Migrations
{
    [Migration(1)]
    public class Migration01 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("SmallPig",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("Name", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("Size", DbType.Int32, ColumnProperty.NotNull)
            );
        }

        public override void Revert()
        {
            Database.RemoveTable("SmallPig");
        }
    }
}