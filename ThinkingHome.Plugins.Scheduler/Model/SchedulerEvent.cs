using System;
namespace ThinkingHome.Plugins.Scheduler.Model
{
    public class SchedulerEvent
    {
		public Guid Id { get; set; }

		public string Name { get; set; }

		public string EventAlias { get; set; }

		public int Hours { get; set; }

		public int Minutes { get; set; }

		public bool Enabled { get; set; }
	}
}
