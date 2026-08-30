using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Cron.Model;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Events;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Cron
{
    public class CronPlugin(DatabasePlugin database, ScriptsPlugin scripts) : PluginBase {
        /// <summary>Название события, которое генерируется при запуске записи расписания</summary>
        public const string TaskStartedEventName = "cron:task:started";

        /// <summary>Ключ словаря meta, в котором передается id записи расписания</summary>
        public const string TaskIdMetaKey = "taskId";

        private const int CHECK_INTERVAL = 20000; // ms

        private const int ACTIVE_PERIOD = 5; // minutes

        private readonly Lock lockObject = new();

        private DateTime lastEventTime = DateTime.MinValue;

        private List<CronScheduleItem> schedule;

        private List<CronHandlerDelegate> handlers;

        private ScriptEventEmitter taskStarted;

        public override void InitPlugin()
        {
            base.InitPlugin();

            handlers = RegisterHandlers();
        }

        [ConfigureScriptEvents]
        public void RegisterScriptEvents(ScriptEventsConfigurationBuilder config)
        {
            taskStarted = config.RegisterEvent(TaskStartedEventName);
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
                    Logger.LogInformation(
                        "register cron handler: {Method} ({PluginType})",
                        mi.Method.Method.Name,
                        pluginType.FullName);

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

                    foreach (var task in active)
                    {
                        Logger.LogInformation("cron task started: {TaskId}", task.TaskId);

                        if (!string.IsNullOrEmpty(task.EventName))
                        {
                            scripts.EmitUserEvent(task.EventName);
                        }

                        _ = SafeInvokeAsync(handlers, h => h(task.TaskId));

                        taskStarted?.Invoke(new Dictionary<string, string> { [TaskIdMetaKey] = task.TaskId.ToString() });
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
                using (var session = database.OpenSession())
                {
                    var loaded = new List<CronScheduleItem>();

                    foreach (var task in session.Set<CronTask>().Where(t => t.Enabled))
                    {
                        try
                        {
                            loaded.Add(CronScheduleItem.FromTask(task));
                        }
                        catch (Exception ex)
                        {
                            // некорректное выражение (например, отредактированное в БД
                            // напрямую) не должно валить загрузку всего расписания
                            Logger.LogError(ex, "invalid cron expression in task {TaskId}", task.Id);
                        }
                    }

                    schedule = loaded;

                    Logger.LogInformation("{Count} cron tasks are loaded", schedule.Count);
                }
            }
        }

        #endregion

    }
}
