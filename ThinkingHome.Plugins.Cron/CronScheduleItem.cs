using System;
using NCrontab;
using ThinkingHome.Plugins.Cron.Model;

namespace ThinkingHome.Plugins.Cron
{
    public class CronScheduleItem
    {
        public readonly Guid TaskId;
        public readonly string EventAlias;
        private readonly CrontabSchedule schedule;

        public CronScheduleItem(Guid taskId, string eventAlias, string pattern)
        {
            TaskId = taskId;
            EventAlias = eventAlias;
            schedule = CrontabSchedule.Parse(pattern);
        }

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
