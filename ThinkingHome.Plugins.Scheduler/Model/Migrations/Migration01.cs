using System.Data;
using ThinkingHome.Migrator.Framework;
using ThinkingHome.Migrator.Framework.Extensions;

namespace ThinkingHome.Plugins.Scheduler.Model.Migrations
{
	[Migration(1)]
	public class Migration01 : Migration
	{
		public override void Apply()
		{
			Database.AddTable("Scheduler_SchedulerEvent",
				new Column("Id", DbType.Guid, ColumnProperty.PrimaryKey),
                new Column("Name", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("EventAlias", DbType.String.WithSize(int.MaxValue), ColumnProperty.NotNull),
                new Column("Hours", DbType.Int32, ColumnProperty.NotNull),
				new Column("Minutes", DbType.Int32, ColumnProperty.NotNull),
                new Column("Enabled", DbType.Boolean, ColumnProperty.NotNull)
			);
		}

		public override void Revert()
		{
			Database.RemoveTable("Scheduler_SchedulerEvent");
		}
	}
}
