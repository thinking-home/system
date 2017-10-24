using System;
using System.Linq;
using Jint;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Scripts.Internal;
using ThinkingHome.Plugins.Scripts.Model;

namespace ThinkingHome.Plugins.Scripts
{
    public class ScriptsPlugin : PluginBase
    {
        private object host;

        private readonly ObjectRegistry<Delegate> methods = new ObjectRegistry<Delegate>();

        public override void InitPlugin()
        {
            // регистрируем методы плагинов
            Context.GetAllPlugins()
                .SelectMany(plugin => plugin.FindMethods<ScriptCommandAttribute, Delegate>())
                .ToObjectRegistry(methods, mi => mi.Meta.Alias, mi => mi.Method);

            methods.ForEach((name, method) => Logger.LogInformation($"register script method \"{name}\""));

            // создаем объект host
            host = new
            {
                scripts = new ScriptMethodContainer<Func<object[], object>>(CreateScriptDelegateByName),
                api = new ScriptMethodContainer<Delegate>(GetMethodDelegate),
                log = new ScriptLogger(Logger),
                emit = new Action<string, object[]>(EmitScriptEvent)
            };
        }

        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserScript>(cfg => cfg.ToTable("Scripts_UserScript"));
            modelBuilder.Entity<ScriptEventHandler>(cfg => cfg.ToTable("Scripts_EventHandler"));
        }

        #region public API

        public object ExecuteScript(string body, params object[] args)
        {
            return CreateScriptDelegate(null, body)(args);
        }

        public object ExecuteScript(UserScript script, params object[] args)
        {
            return CreateScriptDelegate(script.Name, script.Body)(args);
        }

        public object ExecuteScriptByName(string name, params object[] args)
        {
            return CreateScriptDelegateByName(name)(args);
        }

        public void EmitScriptEvent(string eventAlias, params object[] args)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                EmitScriptEvent(session, eventAlias, args);
            }
        }

        public void EmitScriptEvent(DbContext session, string eventAlias, params object[] args)
        {
            Logger.LogDebug($"execute script event handlers ({eventAlias})");

            // find all subscribed scripts
            var scripts = session.Set<ScriptEventHandler>()
                .Where(s => s.EventAlias == eventAlias)
                .Select(x => x.UserScript)
                .ToList();

            // execute scripts async
            scripts.ForEach(script => SafeInvoke(script, s => ExecuteScript(s, args), true));
        }

        #endregion

        #region private

        private Func<object[], object> CreateScriptDelegate(string name, string body)
        {
            return new ScriptContext(name, body, host, Logger).Execute;
        }

        private Func<object[], object> CreateScriptDelegateByName(string name)
        {
            try
            {
                using (var session = Context.Require<DatabasePlugin>().OpenSession())
                {
                    var script = session.Set<UserScript>().Single(s => s.Name == name);
                    return CreateScriptDelegate(script.Name, script.Body);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(new EventId(), ex, $"Can't find the script '{name}'");
                return null;
            }
        }

        private Delegate GetMethodDelegate(string name)
        {
            try
            {
                return methods[name];
            }
            catch (Exception ex)
            {
                Logger.LogError(new EventId(), ex, $"Can't find the method '{name}'");
                return null;
            }
        }

        #endregion
    }
}
