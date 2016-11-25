using System;
using System.Threading;

namespace ThinkingHome.Plugins.Timer
{
    public class InternalTimer : IDisposable
    {
        private readonly System.Threading.Timer timer;
        private readonly int delay;
        private readonly int interval;
        private readonly TimerCallbackDelegate callback;

        public InternalTimer(int delay, int interval, TimerCallbackDelegate callback)
        {
            this.delay = delay;
            this.interval = interval;
            this.callback = callback;

            timer = new System.Threading.Timer(ExecuteAction, null, Timeout.Infinite, interval);
        }

        public void Start()
        {
            timer.Change(delay, interval);
        }

        public void Stop()
        {
            timer.Change(Timeout.Infinite, interval);
        }

        private void ExecuteAction(object state)
        {
            callback?.Invoke(DateTime.Now);
        }

        public void Dispose()
        {
            timer.Dispose();
        }
    }
}