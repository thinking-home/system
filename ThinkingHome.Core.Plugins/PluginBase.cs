using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
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

        #region find methods

        public PluginMethodInfo<TAttribute, TDelegate>[] FindMethodsByAttribute<TAttribute, TDelegate>()
            where TAttribute: Attribute where TDelegate : class
        {
            return GetType()
                .GetTypeInfo()
                .GetMethods()
                .SelectMany(GetMethodAttributes<TAttribute>)
                .Select(GetPluginMethodInfo<TAttribute, TDelegate>)
                .ToArray();
        }

        private static IEnumerable<Tuple<MethodInfo, TAttribute>> GetMethodAttributes<TAttribute>(MethodInfo method)
            where TAttribute: Attribute
        {
            return method
                .GetCustomAttributes<TAttribute>()
                .Select(attr => new Tuple<MethodInfo, TAttribute>(method, attr));
        }

        private PluginMethodInfo<TAttribute, TDelegate> GetPluginMethodInfo<TAttribute, TDelegate>(
            Tuple<MethodInfo, TAttribute> obj)
            where TAttribute: Attribute where TDelegate : class
        {
            var delegateType = typeof(TDelegate);

            if (delegateType == typeof(Delegate))
            {
                delegateType = obj.Item1.GetDelegateType();
            }

            var mthodDelegate = obj.Item1.IsStatic
                ? obj.Item1.CreateDelegate(delegateType)
                : obj.Item1.CreateDelegate(delegateType, this);

            return new PluginMethodInfo<TAttribute, TDelegate>(obj.Item2, mthodDelegate as TDelegate);
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
