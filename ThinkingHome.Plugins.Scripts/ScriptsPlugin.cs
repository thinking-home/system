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
            scriptHost = new ScriptHost(null, Logger, ExecuteScriptByName);
            engine.SetValue("host", scriptHost);
        }

        /// <summary>
        /// Запуск скриптов (для плагинов)
        /// </summary>
        public void ExecuteScript(UserScript script, params object[] args)
        {
            try
            {
                string json = args.ToJson("[]");
                string code =  $"(function(){{{script.Body}}}).apply(this,{json});";

                engine.Execute(code);
            }
            catch (Exception ex)
            {
                Logger.Error(ex, $"error in user script {script.Name}");
            }
        }

        /// <summary>
        /// Запуск скриптов по имени (из других скриптов)
        /// </summary>
        public void ExecuteScriptByName(string scriptName, object[] args)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>().First(s => s.Name == scriptName);

                ExecuteScript(script, args);
            }
        }

        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserScript>();
        }
    }
}
