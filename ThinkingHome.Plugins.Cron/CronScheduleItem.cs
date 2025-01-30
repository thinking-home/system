using System;
using NCrontab;
using ThinkingHome.Plugins.Cron.Model;

namespace ThinkingHome.Plugins.Cron
{
    public class CronScheduleItem(Guid taskId, string eventAlias, string pattern) {
        public readonly Guid TaskId = taskId;
        public readonly string EventAlias = eventAlias;
        private readonly CrontabSchedule schedule = CrontabSchedule.Parse(pattern);

        public bool IsActive(DateTime from, DateTime to)
        {
            return schedule.GetNextOccurrence(from) <= to;
        }

        public static CronScheduleItem FromTask(CronTask task)
        {
            return new CronScheduleItem(task.Id, task.EventAlias, task.GetPattern());
        }
    }
}
