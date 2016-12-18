using System;

namespace ThinkingHome.Plugins.Timer
{
    public delegate void TimerCallbackDelegate(DateTime now);

    public delegate void RegisterTimerDelegate(TimerCallbackDelegate callback, int interval, int? delay = null);

    public interface ITimerOwner
    {
        void RegisterTimers(RegisterTimerDelegate addTimer);
    }
}