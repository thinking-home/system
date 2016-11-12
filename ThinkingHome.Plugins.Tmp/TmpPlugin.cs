using System;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.Info("init tmp plugin {0}", Guid.NewGuid());

            Context.Require<TimerPlugin>().OnEvent += MimimiTimer;
        }

        public override void StartPlugin()
        {
            Logger.Warn("start tmp plugin {0}", Guid.NewGuid());
        }

        public override void StopPlugin()
        {
            Logger.Debug("stop tmp plugin {0}", Guid.NewGuid());
        }

        public void MimimiTimer(DateTime now)
        {
            Logger.Warn("mi mi mi {0:HH:mm:ss}", now);
        }
    }
}