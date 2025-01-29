using System.Data;
using ThinkingHome.Migrator.Framework;

namespace ThinkingHome.Plugins.Waterius.Model.Migrations;

[Migration(1)]
public class Migration01 : Migration 
{
    
    public override void Apply()
    {
        Database.AddTable("Waterius_MeterData",
            new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
            new Column("Date", DbType.Date, ColumnProperty.NotNull),
            new Column("Value0", DbType.Decimal, ColumnProperty.Null),
            new Column("Value1", DbType.Decimal, ColumnProperty.Null)
        );
    }

    public override void Revert()
    {
        Database.RemoveTable("Waterius_MeterData");
    }
}
