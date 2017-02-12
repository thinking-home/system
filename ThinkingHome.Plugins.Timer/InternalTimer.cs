using System;
using System.Threading;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Timer
{
    public class InternalTimer : IDisposable
    {
        private readonly int delay;
        private readonly int interval;
        private readonly System.Threading.Timer timer;

        public InternalTimer(int delay, int interval, TimerCallbackDelegate callback, ILogger logger)
        {
            this.delay = delay;
            this.interval = interval;

            var context = new EventContext<TimerCallbackDelegate>(callback, cb => cb(DateTime.Now), logger);

            timer = new System.Threading.Timer(state => context.Invoke(), null, Timeout.Infinite, interval);
        }

        public void Start()
        {
            timer.Change(delay, interval);
        }

        public void Stop()
        {
            timer.Change(Timeout.Infinite, interval);
        }

        public void Dispose()
        {
            timer.Dispose();
        }
    }
}