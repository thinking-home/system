using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Cron.Model.Migrations
{
	[Migration(1)]
	public class Migration01 : Migration
	{
		public override void Apply()
		{
			Database.AddTable("Cron_Task",
				new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("Name", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("EventAlias", DbType.String.WithSize(int.MaxValue)),
				new Column("Month", DbType.Int32),
                new Column("Day", DbType.Int32),
                new Column("Hour", DbType.Int32),
				new Column("Minute", DbType.Int32),
                new Column("Enabled", DbType.Boolean, ColumnProperty.NotNull)
			);
		}

		public override void Revert()
		{
			Database.RemoveTable("Cron_Task");
		}
	}
}
