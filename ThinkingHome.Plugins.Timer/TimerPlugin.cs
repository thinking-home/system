using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Timer
{
    public class TimerPlugin : PluginBase
    {
        #region fields

        public static readonly Random random = new Random();

        public readonly object lockObject = new object();

        public readonly List<InternalTimer> timers = new List<InternalTimer>();

        #endregion

        public override void InitPlugin()
        {
            var callbacks = Context.GetAllPlugins()
                .SelectMany(plugin =>
                    plugin.FindMethodsByAttribute<TimerCallbackAttribute, TimerCallbackDelegate>());

            foreach (var callback in callbacks)
            {
                var timer = new InternalTimer(
                    callback.MetaData.Delay ?? random.Next(callback.MetaData.Interval),
                    callback.MetaData.Interval,
                    callback.Method, Logger);

                timers.Add(timer);
            }
        }

        public override void StartPlugin()
        {
            timers.ForEach(timer => timer.Start());
        }

        public override void StopPlugin()
        {
            timers.ForEach(timer => timer.Dispose());
        }
    }
}