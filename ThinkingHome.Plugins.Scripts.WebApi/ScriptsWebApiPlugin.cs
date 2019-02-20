using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Model;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.Scripts.WebApi
{
    public class ScriptsWebApiPlugin : PluginBase
    {
        #region scripts

        [WebApiMethod("/api/scripts/web-api/list")]
        public object GetScriptList(HttpRequestParams request)
        {
            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

            using (var session = database.OpenSession())
            {
                var list = session.Set<UserScript>()
                    .Select(x => new { id = x.Id, name = x.Name }).ToArray(); 

                return list;
            }

        }

        [WebApiMethod("/api/scripts/web-api/get")]
        public object LoadScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

            using (var session = database.OpenSession())
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

            var database = Context.Require<DatabasePlugin>();

            if (database.IsInitialized)
            {
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

                    return script.Id;
                }
            }

            return null;
        }

        [WebApiMethod("/api/scripts/web-api/delete")]
        public object DeleteScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

            using (var session = database.OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                session.Set<UserScript>().Remove(script);
                session.SaveChanges();
            }

            return null;
        }

        [WebApiMethod("/api/scripts/web-api/execute")]
        public object RunScript(HttpRequestParams request)
        {
            var id = request.GetRequiredGuid("id");

            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

            using (var session = database.OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Id == id);

                return Context.Require<ScriptsPlugin>().ExecuteScript(script);
            }

            
        }

        #endregion

        #region script event

        [WebApiMethod("/api/scripts/web-api/subscription/list")]
        public object GetSubscriptionList(HttpRequestParams request)
        {
            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

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

                return list;
            }



        }

        [WebApiMethod("/api/scripts/web-api/subscription/add")]
        public object AddSubscription(HttpRequestParams request)
        {
            var scriptId = request.GetRequiredGuid("scriptId");
            var eventAlias = request.GetRequiredString("eventAlias");

            var database = Context.Require<DatabasePlugin>();

            if (!database.IsInitialized) return null;

            using (var session = database.OpenSession())
            {
                var guid = Guid.NewGuid();

                var subscription = new ScriptEventHandler
                {
                    Id = guid,
                    EventAlias = eventAlias,
                    UserScriptId = scriptId
                };

                session.Set<ScriptEventHandler>().Add(subscription);
                session.SaveChanges();

                return guid;
            }
        }

        [WebApiMethod("/api/scripts/web-api/subscription/delete")]
        public object DeleteSubscription(HttpRequestParams request)
        {
            var subscriptionId = request.GetRequiredGuid("subscriptionId");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
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
