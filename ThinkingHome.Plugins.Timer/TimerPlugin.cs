using System.Threading;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Timer
{
    [Plugin]
    public class TimerPlugin : PluginBase
    {
        private const int TIMER_INTERVAL = 30000;
        //private const int TIMER_INTERVAL = 2000;

        private System.Threading.Timer timer;

        public override void InitPlugin()
        {
            timer = new System.Threading.Timer(Callback, null, Timeout.Infinite, TIMER_INTERVAL);
        }

        public override void StartPlugin()
        {
            timer.Change(0, TIMER_INTERVAL);
        }

        public override void StopPlugin()
        {
            timer.Change(Timeout.Infinite, TIMER_INTERVAL);
        }

        private void Callback(object state)
        {
            Logger.Info("сработал таймер");
        }
    }
}