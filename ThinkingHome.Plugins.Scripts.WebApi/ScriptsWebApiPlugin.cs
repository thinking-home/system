using System;
using System.Linq;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Model;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Scripts.WebApi
{
    public class ScriptsWebApiPlugin : PluginBase
    {
        [HttpCommand("/api/scripts/list")]
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

        [HttpCommand("/api/scripts/get")]
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

        [HttpCommand("/api/scripts/save")]
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

        [HttpCommand("/api/scripts/delete")]
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

        [HttpCommand("/api/scripts/execute")]
        public object RunScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                Context.Require<ScriptsPlugin>().ExecuteScript(script);
            }

            return null;
        }
    }
}