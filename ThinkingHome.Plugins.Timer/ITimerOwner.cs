namespace ThinkingHome.Plugins.Timer
{
    public interface ITimerOwner
    {
        void RegisterTimers(RegisterTimerDelegate addTimer);
    }
}