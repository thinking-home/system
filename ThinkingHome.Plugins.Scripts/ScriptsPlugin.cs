using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Esprima;
using Jint;
using NLog;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts.Model;

namespace ThinkingHome.Plugins.Scripts
{    
    public class ScriptsPlugin : PluginBase
    {
        private ScriptHost scriptHost;

        private static Engine engine = new Engine(options => options.DebugMode());

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
                string code =  $"(function(){{{script.Body}}})({json});";

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
        private void ExecuteScriptByName(string scriptName, object[] args)
        {
            using (var session = Context.Require<DatabasePlugin>().OpenSession())
            {
                var script = session.Set<UserScript>().First(s => s.Name == scriptName);

                ExecuteScript(script, args);
            }
        }
    }
}
