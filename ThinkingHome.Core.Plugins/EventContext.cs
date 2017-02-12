using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace ThinkingHome.Core.Plugins
{
    public class EventContext<T>
    {
        private readonly T handler;
        private readonly Action<T> action;
        private readonly ILogger logger;

        public EventContext(T handler, Action<T> action, ILogger logger)
        {
            this.handler = handler;
            this.action = action;
            this.logger = logger;
        }

        public void Invoke(bool async)
        {
            if (async)
            {
                InvokeAsync();
            }
            else
            {
                Invoke();
            }
        }

        public void Invoke()
        {
            try
            {
                action(handler);
            }
            catch (Exception ex)
            {
                logger.LogError(0, ex, "Event handler failed");
            }
        }

        public void InvokeAsync()
        {
            Task.Factory.StartNew(Invoke);
        }
    }
}