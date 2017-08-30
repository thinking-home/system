using System;
using System.Linq;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Cron.Model;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Cron.WebApi
{
    public class CronWebApiPlugin : PluginBase
    {
        private object ToApiModel(CronTask task)
        {
            return new
            {
                id = task.Id,
                name = task.Name,
                eventAlias = task.EventAlias,
                enabled = task.Enabled,
                month = task.Month,
                day = task.Day,
                hour = task.Hour,
                minute = task.Minute
            };
        }

        [WebApiMethod("/api/cron/web-api/list")]
        public object GetTaskList(HttpRequestParams request)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var list = session.Set<CronTask>()
                    .OrderBy(e => e.Month)
                    .ThenBy(e => e.Day)
                    .ThenBy(e => e.Hour)
                    .ThenBy(e => e.Minute)
                    .Select(ToApiModel)
                    .ToArray();

                return list;
            }
        }

        [WebApiMethod("/api/cron/web-api/get")]
        public object LoadTask(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var task = session.Set<CronTask>().Single(x => x.Id == id);
                
                return ToApiModel(task);
            }
        }

        [WebApiMethod("/api/cron/web-api/save")]
        public object SaveTask(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var eventAlias = request.GetString("eventAlias");
            var month = request.GetInt32("month");
            var day = request.GetInt32("day");
            var hour = request.GetInt32("hour");
            var minute = request.GetInt32("minute");
            var enabled = request.GetRequiredBool("enabled");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                CronTask task;

                if (id.HasValue)
                {
                    task = session.Set<CronTask>().Single(s => s.Id == id.Value);
                }
                else
                {
                    task = new CronTask { Id = Guid.NewGuid() };
                    session.Set<CronTask>().Add(task);
                }

                task.Name = name;
                task.EventAlias = eventAlias;
                task.Enabled = enabled;
                task.Month = month;
                task.Day = day;
                task.Hour = hour;
                task.Minute = minute;
                session.SaveChanges();
                
                // reset cron event cache
                Context.Require<CronPlugin>().ReloadTasks();

                return task.Id;
            }
        }

        [WebApiMethod("/api/cron/web-api/delete")]
        public object DeleteTask(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var task = session.Set<CronTask>().Single(s => s.Id == id);

                session.Set<CronTask>().Remove(task);
                session.SaveChanges();
                
                // reset cron event cache
                Context.Require<CronPlugin>().ReloadTasks();
            }

            return null;
        }        
    }
}
