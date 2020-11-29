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
        private readonly DatabasePlugin database;
        private readonly ScriptsPlugin scripts;

        public ScriptsWebApiPlugin(DatabasePlugin database, ScriptsPlugin scripts)
        {
            this.database = database;
            this.scripts = scripts;
        }

        #region scripts

        [HttpDynamicResource("/api/scripts/web-api/list")]
        public HttpHandlerResult GetScriptList(HttpRequestParams request)
        {
            using (var session = database.OpenSession())
            {
                var list = session.Set<UserScript>()
                    .Select(x => new { id = x.Id, name = x.Name })
                    .ToArray();

                return HttpHandlerResult.Json(list);
            }
        }

        [HttpDynamicResource("/api/scripts/web-api/get")]
        public HttpHandlerResult LoadScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = database.OpenSession())
            {
                var script = session.Set<UserScript>()
                    .Select(x => new { id = x.Id, name = x.Name, body = x.Body })
                    .Single(x => x.id == id);

                return HttpHandlerResult.Json(script);
            }
        }

        [HttpDynamicResource("/api/scripts/web-api/save")]
        public HttpHandlerResult SaveScript(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var body = request.GetRequiredString("body");

            using (var session = database.OpenSession())
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

                return HttpHandlerResult.Json(new { scriptId = script.Id });
            }
        }

        [HttpDynamicResource("/api/scripts/web-api/delete")]
        public HttpHandlerResult DeleteScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = database.OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                session.Set<UserScript>().Remove(script);
                session.SaveChanges();
            }

            return null;
        }

        [HttpDynamicResource("/api/scripts/web-api/execute")]
        public HttpHandlerResult RunScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using (var session = database.OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                object result = scripts.ExecuteScript(script);

                return HttpHandlerResult.Json(result);
            }
        }

        #endregion

        #region script event

        [HttpDynamicResource("/api/scripts/web-api/subscription/list")]
        public HttpHandlerResult GetSubscriptionList(HttpRequestParams request)
        {
            using (var session = database.OpenSession())
            {
                var list = session.Set<ScriptEventHandler>()
                    .Select(x => new
                    {
                        id = x.Id,
                        scriptId = x.UserScript.Id,
                        scriptName = x.UserScript.Name,
                        eventAlias = x.EventAlias
                    })
                    .ToList();

                return HttpHandlerResult.Json(list);
            }
        }

        [HttpDynamicResource("/api/scripts/web-api/subscription/add")]
        public HttpHandlerResult AddSubscription(HttpRequestParams request)
        {
            var scriptId = request.GetRequiredGuid("scriptId");
            var eventAlias = request.GetRequiredString("eventAlias");

            using (var session = database.OpenSession())
            {
                var subscriptionId = Guid.NewGuid();

                var subscription = new ScriptEventHandler
                {
                    Id = subscriptionId,
                    EventAlias = eventAlias,
                    UserScriptId = scriptId
                };

                session.Set<ScriptEventHandler>().Add(subscription);
                session.SaveChanges();

                return HttpHandlerResult.Json(new { subscriptionId }) ;
            }
        }

        [HttpDynamicResource("/api/scripts/web-api/subscription/delete")]
        public HttpHandlerResult DeleteSubscription(HttpRequestParams request)
        {
            var subscriptionId = request.GetRequiredGuid("subscriptionId");

            using (var session = database.OpenSession())
            {
                var subscription = session.Set<ScriptEventHandler>().Single(s => s.Id == subscriptionId);
                session.Set<ScriptEventHandler>().Remove(subscription);
                session.SaveChanges();
            }

            return null;
        }

        #endregion
    }
}
