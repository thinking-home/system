using System;
using System.Collections.Generic;

namespace ThinkingHome.Plugins.Timer
{
    public class TimerCollection : ITimerCollection, IDisposable
    {
        public static readonly Random random = new Random();

        public readonly object lockObject = new object();

        public readonly List<InternalTimer> timers = new List<InternalTimer>();

        private bool isStarted;

        #region ITimerCollection members

        public void AddTimer(int interval, TimerCallbackDelegate callback)
        {
            AddTimer(random.Next(interval), interval, callback);
        }

        public void AddTimer(int delay, int interval, TimerCallbackDelegate callback)
        {
            lock (lockObject)
            {
                var timer = new InternalTimer(delay, interval, callback);

                timers.Add(timer);

                if (isStarted)
                {
                    timer.Start();
                }

            }
        }

        #endregion

        public void Start()
        {
            lock (lockObject)
            {
                isStarted = true;
                timers.ForEach(timer => timer.Start());
            }
        }

        public void Stop()
        {
            lock (lockObject)
            {
                isStarted = false;
                timers.ForEach(timer => timer.Stop());
            }
        }

        public void Dispose()
        {
            lock (lockObject)
            {
                timers.ForEach(timer => timer.Dispose());
            }
        }
    }
}