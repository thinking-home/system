using System;
using System.Collections.Generic;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Timer
{
    public class TimerPlugin : PluginBase
    {
        #region fields

        public static readonly Random random = new Random();

        public readonly object lockObject = new object();

        public readonly List<InternalTimer> timers = new List<InternalTimer>();

        private bool inited = false;

        #endregion

        public override void InitPlugin()
        {
            foreach (var plugin in Context.GetAllPlugins<ITimerOwner>())
            {
                plugin.RegisterTimers(AddTimer);
            }

            inited = true;
        }

        public override void StartPlugin()
        {
            lock (lockObject)
            {
                timers.ForEach(timer => timer.Start());
            }
        }

        public override void StopPlugin()
        {
            lock (lockObject)
            {
                timers.ForEach(timer => timer.Dispose());
            }
        }

        private void AddTimer(TimerCallbackDelegate callback, int interval, int? delay = null)
        {
            if (inited) throw new InvalidOperationException();

            lock (lockObject)
            {
                var timer = new InternalTimer(delay ?? random.Next(interval), interval, callback, Logger);
                timers.Add(timer);
            }
        }
    }
}