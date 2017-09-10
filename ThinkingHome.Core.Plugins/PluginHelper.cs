using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Core.Plugins
{
    public static class PluginHelper
    {
        public static PluginMethodInfo<TAttribute, TDelegate>[] FindMethodsByAttribute<TAttribute, TDelegate>(
            this PluginBase plugin)
            where TAttribute : Attribute where TDelegate : class
        {
            return plugin
                .GetType()
                .GetTypeInfo()
                .GetMethods()
                .SelectMany(GetMethodAttributes<TAttribute>)
                .Select(x => GetPluginMethodInfo<TAttribute, TDelegate>(plugin, x))
                .ToArray();
        }

        private static IEnumerable<Tuple<MethodInfo, TAttribute>> GetMethodAttributes<TAttribute>(MethodInfo method)
            where TAttribute : Attribute
        {
            return method
                .GetCustomAttributes<TAttribute>()
                .Select(attr => new Tuple<MethodInfo, TAttribute>(method, attr));
        }

        private static PluginMethodInfo<TAttribute, TDelegate> GetPluginMethodInfo<TAttribute, TDelegate>(
            PluginBase plugin,
            Tuple<MethodInfo, TAttribute> obj)
            where TAttribute : Attribute where TDelegate : class
        {
            var delegateType = typeof(TDelegate);

            if (delegateType == typeof(Delegate))
                delegateType = obj.Item1.GetDelegateType();

            var mthodDelegate = obj.Item1.IsStatic
                ? obj.Item1.CreateDelegate(delegateType)
                : obj.Item1.CreateDelegate(delegateType, plugin);

            return new PluginMethodInfo<TAttribute, TDelegate>(obj.Item2, mthodDelegate as TDelegate);
        }

        public static void SafeInvoke<T>(this PluginBase plugin, IEnumerable<T> handlers, Action<T> action,
            bool async = false)
        {
            if (handlers == null) return;

            foreach (var handler in handlers)
                SafeInvoke(plugin, handler, action, async);
        }

        public static void SafeInvoke<T>(this PluginBase plugin, T handler, Action<T> action, bool async = false)
        {
            if (handler == null) return;

            var context = new EventContext<T>(handler, action, plugin.Logger);
            context.Invoke(async);
        }
    }
}