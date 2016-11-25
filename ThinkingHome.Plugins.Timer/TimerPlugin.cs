using System;
using System.Collections.Generic;
using System.Threading;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Timer
{
    public class TimerPlugin : PluginBase
    {
        #region fields

        private readonly TimerCollection timers = new TimerCollection();

        #endregion

        public override void InitPlugin()
        {
            foreach (var plugin in Context.GetAllPlugins().FilterByType<ITimerOwner>())
            {
                plugin.RegisterTimers(timers);
            }
        }

        public override void StartPlugin()
        {
            timers.Start();
        }

        public override void StopPlugin()
        {
            timers.Dispose();
        }
    }
}