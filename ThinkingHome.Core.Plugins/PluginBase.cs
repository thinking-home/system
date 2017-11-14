using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Core.Plugins
{
    public abstract class PluginBase
    {
        #region properties

        public IServiceContext Context { get; set; }

        public ILogger Logger { get; set; }

        public IConfigurationSection Configuration { get; set; }

        public IStringLocalizer StringLocalizer { get; set; }

        #endregion

        #region life cycle

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

        public void SafeInvoke<T>(IEnumerable<T> handlers, Action<T> action, bool async = false)
        {
            if (handlers == null) return;

            foreach (var handler in handlers)
            {
                SafeInvoke(handler, action, async);
            }
        }

        public void SafeInvoke<T>(T handler, Action<T> action, bool async = false)
        {
            if (handler == null) return;

            var context = new EventContext<T>(handler, action, Logger);
            context.Invoke(async);
        }
    }
}
