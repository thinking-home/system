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

        /*
        [WebApiMethod("/api/scripts/web-api/save")]
        public object SaveScript(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var body = request.GetRequiredString("body");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                UserScript script;

                if (id.HasValue)
                {
                    script = session.Set<UserScript>().Single(s => s.Id == id.Value);
                }
                else
                {
                    script = new UserScript { Id = Guid.NewGuid() };
                    session.Set<UserScript>().Add(script);
                }

                script.Name = name;
                script.Body = body;
                session.SaveChanges();

                return script.Id;
            }
        }

        [WebApiMethod("/api/scripts/web-api/delete")]
        public object DeleteScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                session.Set<UserScript>().Remove(script);
                session.SaveChanges();
            }

            return null;
        }
        
        */
        
    }
}