using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Cron.Model;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Cron
{
    public class CronPlugin: PluginBase
    {
        private const int CHECK_INTERVAL = 20000; // ms

        private const int ACTIVE_PERIOD = 5; // minutes

        private readonly object lockObject = new object();

        private DateTime lastEventTime = DateTime.MinValue;

        private List<CronScheduleItem> schedule;

        private List<CronHandlerDelegate> handlers;

        public override void InitPlugin()
        {
            base.InitPlugin();
            schedule = new List<CronScheduleItem>();

            handlers = RegisterHandlers();
        }

        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CronTask>(cfg => cfg.ToTable("Cron_Task"));
        }

        private List<CronHandlerDelegate> RegisterHandlers()
        {
            var list = new List<CronHandlerDelegate>();

            foreach (var plugin in Context.GetAllPlugins())
            {
                var pluginType = plugin.GetType();

                foreach (var mi in plugin.FindMethods<CronHandlerAttribute, CronHandlerDelegate>())
                {
                    Logger.LogInformation($"register cron handler: \"{mi.Method.Method.Name}\" ({pluginType.FullName})");
                    list.Add(mi.Method);
                }
            }

            return list;
        }

        #region public

        public void ReloadTasks()
        {
            lock (lockObject)
            {
                schedule = null;
                LoadTasks();
            }
        }

        [TimerCallback(CHECK_INTERVAL)]
        public void OnTimerElapsed(DateTime now)
        {
            lock (lockObject)
            {
                LoadTasks();

                var from = now.AddMinutes(-ACTIVE_PERIOD);
                var min = lastEventTime <= from ? from : lastEventTime;

                var active = schedule
                    .Where(t => t.IsActive(min, now))
                    .ToArray();

                if (active.Any())
                {
                    lastEventTime = now;

                    var scriptPlugin = Context.Require<ScriptsPlugin>();

                    using (var session = Context.Require<DatabasePlugin>().OpenSession())
                    {
                        foreach (var task in active)
                        {
                            Logger.LogInformation($"cron task started: {task.TaskId}");

                            if (!string.IsNullOrEmpty(task.EventAlias))
                            {
                                scriptPlugin.EmitScriptEvent(session, task.EventAlias);
                            }

                            SafeInvoke(handlers, h => h(task.TaskId), true);

                            scriptPlugin.EmitScriptEvent(session, "cron:task:started", task.TaskId);
                        }
                    }
                }
            }
        }

        #endregion

        #region private

        private void LoadTasks()
        {
            if (schedule == null)
            {
                var database = Context.Require<DatabasePlugin>();
                if (!database.IsInitialized) { return; }

                using (var session = database.OpenSession())
                {
                    schedule = session.Set<CronTask>()
                        .Where(t => t.Enabled)
                        .Select(CronScheduleItem.FromTask)
                        .ToList();

                    Logger.LogInformation($"{schedule.Count} cron tasks are loaded");
                }
            }
        }

        #endregion

    }
}