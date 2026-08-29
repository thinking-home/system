using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;
using ForeignKeyConstraint = ThinkingHome.Migrator.Framework.ForeignKeyConstraint;

namespace ThinkingHome.Plugins.Scripts.Model.Migrations
{
    [Migration(3)]
    public class Migration03 : Migration
    {
        // Ломающее изменение: таблица подписок пересоздается без переноса данных.
        // Старые значения EventAlias не разделить автоматически на события плагинов
        // и пользовательские события (имя которых переезжает в фильтр по meta).
        public override void Apply()
        {
            Database.RemoveTable("Scripts_EventHandler");

            Database.AddTable("Scripts_EventHandler",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("EventName", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("MetaFilter", DbType.String.WithSize(int.MaxValue), ColumnProperty.Null),
                new Column("UserScriptId", DbType.Guid, ColumnProperty.NotNull)
            );

            Database.AddForeignKey("FK_Scripts_EventHandler_UserScriptId",
                "Scripts_EventHandler", "UserScriptId", "Scripts_UserScript", "Id", ForeignKeyConstraint.Cascade);
        }

        public override void Revert()
        {
            Database.RemoveTable("Scripts_EventHandler");

            Database.AddTable("Scripts_EventHandler",
                new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("EventAlias", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("UserScriptId", DbType.Guid, ColumnProperty.NotNull)
            );

            Database.AddForeignKey("FK_Scripts_EventHandler_UserScriptId",
                "Scripts_EventHandler", "UserScriptId", "Scripts_UserScript", "Id", ForeignKeyConstraint.Cascade);
        }
    }
}
