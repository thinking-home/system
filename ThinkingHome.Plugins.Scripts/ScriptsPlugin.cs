using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jint;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Scripts
{    
    public class ScriptsPlugin : PluginBase
    {
        private Engine engine = new Engine(options =>
        {
            options.AllowDebuggerStatement();
        });

        public override void InitPlugin()
        {
            engine.SetValue("host", Logger);
            engine.Execute("for(var i = 0; i < 10; i++) host.Warn(i * 100);debugger;");
        }
    }
}
