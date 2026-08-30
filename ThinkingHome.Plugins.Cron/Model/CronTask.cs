using System;

namespace ThinkingHome.Plugins.Cron.Model
{
    public class CronTask
    {
		public Guid Id { get; set; }

		public string Name { get; set; }

		public string EventName { get; set; }

		/// <summary>Выражение cron из пяти сегментов: минута час день месяц день-недели</summary>
		public string Expression { get; set; }

		public bool Enabled { get; set; }
    }
}
