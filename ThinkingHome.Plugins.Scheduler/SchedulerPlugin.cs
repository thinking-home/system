using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scheduler.Model;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Scheduler
{
    public class SchedulerPlugin : PluginBase
    {
        private const int CHECK_INTERVAL = 10000; // ms
        private const int ALARM_PERIOD = 5; // minutes
        
        private readonly object lockObject = new object();
        
        private DateTime lastEventTime = DateTime.MinValue;
        
        private List<SchedulerEvent> times;
        
        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SchedulerEvent>(cfg => cfg.ToTable("Scheduler_SchedulerEvent"));
        }

        #region public

        public void ReloadTimes()
        {
            lock (lockObject)
            {
                times = null;
                LoadTimes();
            }
        }
        
        public DateTime[] GetNextAlarmTimes(DateTime now)
        {
            lock (lockObject)
            {
                LoadTimes();

                return times
                    .Select(t => GetNextDateTime(t, now, lastEventTime))
                    .OrderBy(t => t)
                    .ToArray();
            }
        }
        
        [TimerCallback(CHECK_INTERVAL)]
        public void OnTimerElapsed(DateTime now)
        {
            lock (lockObject)
            {
                LoadTimes();

                var alarms = times.Where(x => CheckTime(x, now, lastEventTime)).ToArray();

                if (alarms.Any())
                {
                    lastEventTime = now;

                    var scriptPlugin = Context.Require<ScriptsPlugin>();

                    using (var session = Context.Require<DatabasePlugin>().OpenSession())
                    {
                        foreach (var alarm in alarms)
                        {
                            scriptPlugin.EmitScriptEvent(session, alarm.EventAlias);
                        }
                    }
                }
            }
        }

        #endregion

        #region private 

        private void LoadTimes()
        {
            if (times == null)
            {
                using (var session = Context.Require<DatabasePlugin>().OpenSession())
                {
                    times = session.Set<SchedulerEvent>()
                        .Where(se => se.Enabled)
                        .ToList();
                    
                    Logger.LogInformation($"Loaded {times.Count} alarm times");
                }
            }
        }
        
        public static DateTime GetNextDateTime(SchedulerEvent schedulerEvent, DateTime now, DateTime lastEventDateTime)
        {
            var dateTime = now.Date.AddHours(schedulerEvent.Hours).AddMinutes(schedulerEvent.Minutes);

            if (dateTime < lastEventDateTime || dateTime.AddMinutes(ALARM_PERIOD) < now )
            {
                dateTime = dateTime.AddDays(1);
            }

            return dateTime;
        }
        
        private bool CheckTime(SchedulerEvent time, DateTime now, DateTime lastEventDateTime)
        {
            // если прошло время звонка будильника
            // и от этого времени не прошло 5 минут
            // и будильник сегодня еще не звонил
            var date = GetNextDateTime(time, now, lastEventDateTime);

            return lastEventDateTime < date && date < now;
        }


        #endregion
    }
}
