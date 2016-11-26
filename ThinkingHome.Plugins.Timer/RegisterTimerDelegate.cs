namespace ThinkingHome.Plugins.Timer
{
    public delegate void RegisterTimerDelegate(TimerCallbackDelegate callback, int interval, int? delay = null);
}