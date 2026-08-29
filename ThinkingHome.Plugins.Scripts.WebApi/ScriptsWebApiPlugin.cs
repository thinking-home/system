using System;
using System.Linq;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Events;
using ThinkingHome.Plugins.Scripts.Model;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Scripts.WebApi
{
    public class ScriptsWebApiPlugin(DatabasePlugin database, ScriptsPlugin scripts) : PluginBase {
        [ConfigureWebServer]
        public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
        {
            config
                .RegisterDynamicResource("/api/scripts/web-api/list", GetScriptList)
                .RegisterDynamicResource("/api/scripts/web-api/get", LoadScript)
                .RegisterDynamicResource("/api/scripts/web-api/save", SaveScript)
                .RegisterDynamicResource("/api/scripts/web-api/delete", DeleteScript)
                .RegisterDynamicResource("/api/scripts/web-api/execute", RunScript)
                .RegisterDynamicResource("/api/scripts/web-api/events/list", GetEventList)
                .RegisterDynamicResource("/api/scripts/web-api/subscription/list",GetSubscriptionList)
                .RegisterDynamicResource("/api/scripts/web-api/subscription/add", AddSubscription)
                .RegisterDynamicResource("/api/scripts/web-api/subscription/delete", DeleteSubscription);
        }
        
        #region scripts

        private HttpHandlerResult GetScriptList(HttpRequestParams request)
        {
            using var session = database.OpenSession();
            var list = session.Set<UserScript>()
                .Select(x => new { id = x.Id, name = x.Name })
                .ToArray();

            return HttpHandlerResult.Json(list);
        }

        private HttpHandlerResult LoadScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using var session = database.OpenSession();
            var script = session.Set<UserScript>()
                .Select(x => new { id = x.Id, name = x.Name, body = x.Body })
                .Single(x => x.id == id);

            return HttpHandlerResult.Json(script);
        }

        private HttpHandlerResult SaveScript(HttpRequestParams request)
        {
            var id = request.GetGuid("id");
            var name = request.GetRequiredString("name");
            var body = request.GetRequiredString("body");

            using var session = database.OpenSession();
            
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

        private HttpHandlerResult DeleteScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using var session = database.OpenSession();
            var script = session.Set<UserScript>().Single(s => s.Id == id);

            session.Set<UserScript>().Remove(script);
            session.SaveChanges();

            return null;
        }

        private HttpHandlerResult RunScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            using var session = database.OpenSession();
            var script = session.Set<UserScript>().Single(s => s.Id == id);

            object result = scripts.ExecuteScript(script);

            return HttpHandlerResult.Json(result);
        }

        #endregion

        #region script event

        private HttpHandlerResult GetEventList(HttpRequestParams request)
        {
            var events = scripts.GetRegisteredEvents()
                .Select(x => new { name = x.Name })
                .ToArray();

            return HttpHandlerResult.Json(new
            {
                events,
                userEvent = new
                {
                    name = ScriptsPlugin.UserEventName,
                    metaKey = ScriptsPlugin.UserEventNameMetaKey
                }
            });
        }

        private HttpHandlerResult GetSubscriptionList(HttpRequestParams request)
        {
            using var session = database.OpenSession();
            var list = session.Set<ScriptEventHandler>()
                .Select(x => new
                {
                    id = x.Id,
                    scriptId = x.UserScript.Id,
                    scriptName = x.UserScript.Name,
                    eventName = x.EventName,
                    metaFilter = x.MetaFilter
                })
                .ToList();

            return HttpHandlerResult.Json(list);
        }

        private HttpHandlerResult AddSubscription(HttpRequestParams request)
        {
            var scriptId = request.GetRequiredGuid("scriptId");
            var eventName = request.GetRequiredString("eventName");

            // фильтр приводится к каноническому виду, чтобы одинаковые
            // фильтры совпадали как строки
            var metaFilter = MetaFilter.Serialize(MetaFilter.Parse(request.GetString("metaFilter")));

            using var session = database.OpenSession();
            var subscriptionId = Guid.NewGuid();

            var subscription = new ScriptEventHandler
            {
                Id = subscriptionId,
                EventName = eventName,
                MetaFilter = string.IsNullOrEmpty(metaFilter) ? null : metaFilter,
                UserScriptId = scriptId
            };

            session.Set<ScriptEventHandler>().Add(subscription);
            session.SaveChanges();

            return HttpHandlerResult.Json(new { subscriptionId }) ;
        }

        private HttpHandlerResult DeleteSubscription(HttpRequestParams request)
        {
            var subscriptionId = request.GetRequiredGuid("subscriptionId");

            using var session = database.OpenSession();
            var subscription = session.Set<ScriptEventHandler>().Single(s => s.Id == subscriptionId);
            session.Set<ScriptEventHandler>().Remove(subscription);
            session.SaveChanges();

            return null;
        }

        #endregion
    }
}
