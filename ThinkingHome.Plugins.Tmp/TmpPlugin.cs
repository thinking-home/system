using System;
using System.Threading;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase
    {
        private int cnt = 0;
        private int cnt2 = 0;

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
            Logger.Warn("begin {0}", cnt2++);
            Thread.Sleep(5000);
            Logger.Warn("mi mi mi {0:HH:mm:ss} - {1}", now, cnt++);
        }
    }
}