using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;

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
                    plugin.FindMethods<TimerCallbackAttribute, TimerCallbackDelegate>());

            foreach (var callback in callbacks)
            {
                var info = callback.Method.GetMethodInfo();

                Logger.LogInformation("Register timer callback {info.Name} for {TypeName}", info.Name, info.DeclaringType?.FullName);

                var timer = new InternalTimer(
                    callback.Meta.Delay ?? random.Next(callback.Meta.Interval),
                    callback.Meta.Interval,
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
