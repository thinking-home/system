namespace ThinkingHome.Plugins.Timer
{
    public interface ITimerCollection
    {
        void AddTimer(int interval, TimerCallbackDelegate callback);

        void AddTimer(int delay, int interval, TimerCallbackDelegate callback);
    }
}