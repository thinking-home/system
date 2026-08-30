using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Cron.Model.Migrations
{
    [Migration(2)]
    public class Migration02 : Migration
    {
        // Ломающее изменение: значения старых числовых сегментов не переносятся,
        // существующие записи получают выражение по умолчанию "* * * * *"
        public override void Apply()
        {
            Database.AddColumn("Cron_Task",
                new Column("Expression", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull, "'* * * * *'"));

            Database.RemoveColumn("Cron_Task", "Month");
            Database.RemoveColumn("Cron_Task", "Day");
            Database.RemoveColumn("Cron_Task", "Hour");
            Database.RemoveColumn("Cron_Task", "Minute");

            Database.RenameColumn("Cron_Task", "EventAlias", "EventName");
        }

        public override void Revert()
        {
            // выражения общего вида (шаги, диапазоны, списки) не раскладываются
            // обратно в числовые сегменты — значения при откате не восстанавливаются
            Database.AddColumn("Cron_Task", new Column("Month", DbType.Int32));
            Database.AddColumn("Cron_Task", new Column("Day", DbType.Int32));
            Database.AddColumn("Cron_Task", new Column("Hour", DbType.Int32));
            Database.AddColumn("Cron_Task", new Column("Minute", DbType.Int32));

            Database.RemoveColumn("Cron_Task", "Expression");

            Database.RenameColumn("Cron_Task", "EventName", "EventAlias");
        }
    }
}
