using System;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.Info("init tmp plugin {0}", Guid.NewGuid());
        }

        public override void StartPlugin()
        {
            Logger.Warn("start tmp plugin {0}", Guid.NewGuid());
        }

        public override void StopPlugin()
        {
            Logger.Debug("stop tmp plugin {0}", Guid.NewGuid());
        }
    }
}