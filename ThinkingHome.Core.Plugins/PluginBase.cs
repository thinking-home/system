using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace ThinkingHome.Core.Plugins
{
    public abstract class PluginBase
    {
        private static int latestDepsIndex;

        public readonly int DependencyIndex;

        protected PluginBase()
        {
            DependencyIndex = Interlocked.Increment(ref latestDepsIndex);
        }

        #region properties

        public IServiceContext Context { get; set; }

        public ILogger Logger { get; set; }

        public IConfigurationSection Configuration { get; set; }

        public IStringLocalizer StringLocalizer { get; set; }

        #endregion

        #region life cycle

        public virtual void NotifyPlugins()
        {

        }

        public virtual void InitPlugin()
        {

        }

        public virtual void StartPlugin()
        {

        }

        public virtual void StopPlugin()
        {

        }

        #endregion

        public void SafeInvoke<T>(IEnumerable<T> handlers, Action<T> action)
        {
            if (handlers == null) return;

            foreach (var handler in handlers)
            {
                SafeInvoke(handler, action);
            }
        }

        public void SafeInvoke<T>(T handler, Action<T> action)
        {
            if (handler == null) return;

            var context = new EventContext<T>(handler, action, Logger);
            context.Invoke();
        }

        public async Task SafeInvokeAsync<T>(IEnumerable<T> handlers, Action<T> action)
        {
            if (handlers == null) return;

            var tasks = handlers.Select(val => SafeInvokeAsync(val, action));

            await Task.WhenAll(tasks);
        }

        public async Task SafeInvokeAsync<T>(T handler, Action<T> action)
        {
            if (handler == null) return;

            var context = new EventContext<T>(handler, action, Logger);
            await context.InvokeAsync();
        }
    }
}
