using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Scripts.Model.Migrations
{
    [Migration(2)]
    public class Migration02 : Migration
    {
        public override void Apply()
        {
            Database.AddTable("Scripts_EventHandler",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("EventAlias", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("UserScriptId", DbType.Guid, ColumnProperty.NotNull)
            );

            Database.AddForeignKey("FK_Scripts_EventHandler_UserScriptId",
                "Scripts_EventHandler", "UserScriptId", "Scripts_UserScript", "Id", ForeignKeyConstraint.Cascade);
        }

        public override void Revert()
        {
            Database.RemoveTable("Scripts_EventHandler");
        }
    }
}