using System;

namespace ThinkingHome.Plugins.Timer
{
    [AttributeUsage(AttributeTargets.Method)]
    public class TimerCallbackAttribute : Attribute
    {
        public int Interval { get; }

        public int? Delay { get; }

        public TimerCallbackAttribute(int interval) : this(interval, null)
        {
        }

        public TimerCallbackAttribute(int interval, int? delay)
        {
            Interval = interval;
            Delay = delay;
        }
    }
}