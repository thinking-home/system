using System;
using System.Linq;
using Jint;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Model;

namespace ThinkingHome.Plugins.Scripts
{    
    public class ScriptsPlugin : PluginBase, IDbModelOwner
    {
        private ScriptHost scriptHost;

        private static Engine engine = new Engine();

        public override void InitPlugin()
        {
            var actions = new InternalDictionary<Delegate>();

            foreach (var plugin in Context.GetAllPlugins<IScriptApiOwner>())
            {
                plugin.RegisterScriptMethods(actions.Register);
            }

            scriptHost = new ScriptHost(actions, Logger, ExecuteScriptByName);
            engine.SetValue("host", scriptHost);
        }

        /// <summary>
        /// Запуск скриптов (для плагинов)
        /// </summary>
        public object ExecuteScript(UserScript script, params object[] args)
        {
            try
            {
                string json = args.ToJson("[]");
                string code =  $"(function(){{{script.Body}}}).apply(this,{json});";

                return engine.Execute(code)
                    .GetCompletionValue()
                    .ToObject();
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"error in user script {script.Name}");
                return null;
            }
        }

        /// <summary>
        /// Запуск скриптов по имени (из других скриптов)
        /// </summary>
        public object ExecuteScriptByName(string scriptName, object[] args)
        {
            Logger.Debug($"execute script: {scriptName}");

            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>().Single(s => s.Name == scriptName);

                return ExecuteScript(script, args);
            }
        }

        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserScript>();
        }
    }
}
