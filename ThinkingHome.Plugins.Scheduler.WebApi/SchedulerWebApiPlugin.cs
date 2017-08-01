using System;
using System.Linq;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scheduler.Model;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Scheduler.WebApi
{
    public class SchedulerWebApiPlugin : PluginBase
    {
        private object ToApiModel(SchedulerEvent e)
        {
            return new
            {
                id = e.Id,
                name = e.Name,
                eventAlias = e.EventAlias,
                enabled = e.Enabled,
                hours = e.Hours,
                minutes = e.Minutes
            };
        }

        [WebApiMethod("/api/scheduler/web-api/list")]
        public object GetSchedulerEventList(HttpRequestParams request)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var list = session.Set<SchedulerEvent>()
                    .OrderBy(e => e.Hours)
                    .ThenBy(e => e.Minutes)
                    .Select(ToApiModel)
                    .ToArray();

                return list;
            }
        }

        [WebApiMethod("/api/scheduler/web-api/get")]
        public object LoadSchedulerEvent(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var schedulerEvent = session.Set<SchedulerEvent>().Single(x => x.Id == id);
                
                return ToApiModel(schedulerEvent);
            }
        }

        [WebApiMethod("/api/scheduler/web-api/save")]
        public object SaveSchedulerEvent(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var eventAlias = request.GetRequiredString("event");
            var enabled = request.GetRequiredBool("enabled");
            var hours = request.GetRequiredInt32("hours");
            var minutes = request.GetRequiredInt32("minutes");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                SchedulerEvent schedulerEvent;

                if (id.HasValue)
                {
                    schedulerEvent = session.Set<SchedulerEvent>().Single(s => s.Id == id.Value);
                }
                else
                {
                    schedulerEvent = new SchedulerEvent { Id = Guid.NewGuid() };
                    session.Set<SchedulerEvent>().Add(schedulerEvent);
                }

                schedulerEvent.Name = name;
                schedulerEvent.EventAlias = eventAlias;
                schedulerEvent.Enabled = enabled;
                schedulerEvent.Hours = hours;
                schedulerEvent.Minutes = minutes;
                session.SaveChanges();
                
                // reset scheduler event cache
                Context.Require<SchedulerPlugin>().ReloadTimes();

                return schedulerEvent.Id;
            }
        }

        [WebApiMethod("/api/scheduler/web-api/delete")]
        public object DeleteSchedulerEvent(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var schedulerEvent = session.Set<SchedulerEvent>().Single(s => s.Id == id);

                session.Set<SchedulerEvent>().Remove(schedulerEvent);
                session.SaveChanges();
                
                // reset scheduler event cache
                Context.Require<SchedulerPlugin>().ReloadTimes();
            }

            return null;
        }        
    }
}