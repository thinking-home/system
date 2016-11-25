namespace ThinkingHome.Plugins.Timer
{
    public interface ITimerOwner
    {
        void RegisterTimers(ITimerCollection collection);
    }
}