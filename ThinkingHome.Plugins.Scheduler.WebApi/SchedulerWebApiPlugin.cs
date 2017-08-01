using System;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Scheduler.WebApi
{
    public class SchedulerWebApiPlugin : PluginBase
    {
        /*
        
        [WebApiMethod("/api/scripts/web-api/list")]
        public object GetScriptList(HttpRequestParams request)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var list = session.Set<UserScript>()
                    .Select(x => new { id = x.Id, name = x.Name })
                    .ToArray();

                return list;
            }
        }

        [WebApiMethod("/api/scripts/web-api/get")]
        public object LoadScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>()
                    .Select(x => new { id = x.Id, name = x.Name, body = x.Body })
                    .Single(x => x.id == id);

                return script;
            }
        }

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