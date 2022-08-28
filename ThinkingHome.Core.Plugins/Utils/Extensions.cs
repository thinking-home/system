using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Newtonsoft.Json;

namespace ThinkingHome.Core.Plugins.Utils
{
    public static class Extensions
    {
        /// <summary>
        /// Сериализация в JSON
        /// </summary>
        public static string ToJson(this object obj, string defaultValue = "")
        {
            return obj == null ? defaultValue : JsonConvert.SerializeObject(obj);
        }

        #region parse

        public static int? ParseInt(this string stringValue)
        {
            if (int.TryParse(stringValue, out var result))
            {
                return result;
            }

            return null;
        }

        public static Guid? ParseGuid(this string stringValue)
        {
            if (Guid.TryParse(stringValue, out var result))
            {
                return result;
            }

            return null;
        }

        public static bool? ParseBool(this string stringValue)
        {
            if (bool.TryParse(stringValue, out var result))
            {
                return result;
            }

            return null;
        }

        #endregion

        #region find attrs

        public static (TAttr Meta, TypeInfo Type, PluginBase Plugin)[] FindAttrs<TAttr>(this IEnumerable<PluginBase> plugins, Func<TAttr, bool> filter = null)
            where TAttr : Attribute
        {
            return plugins
                .SelectMany(p => p.FindAttrs<TAttr>(filter))
                .ToArray();
        }

        public static (TAttr Meta, TypeInfo Type, PluginBase Plugin)[] FindAttrs<TAttr>(this PluginBase plugin, Func<TAttr, bool> filter = null) where TAttr : Attribute
        {
            var fn = filter ?? (a => true);

            var type = plugin.GetType().GetTypeInfo();

            return type
                .GetCustomAttributes<TAttr>()
                .Where(fn)
                .Select(a => (Meta: a, Type: type, Plugin: plugin))
                .ToArray();
        }

        #endregion

        #region find methods

        public static (TAttr Meta, TDelegate Method, PluginBase plugin)[] FindMethods<TAttr, TDelegate>(
            this IEnumerable<PluginBase> plugins) where TAttr: Attribute where TDelegate : class
        {
            return plugins
                .SelectMany(p => p.FindMethods<TAttr, TDelegate>())
                .ToArray();
        }

        public static (TAttr Meta, TDelegate Method, PluginBase plugin)[] FindMethods<TAttr, TDelegate>(this PluginBase plugin)
            where TAttr: Attribute where TDelegate : class
        {
            IEnumerable<Tuple<MethodInfo, TAttr>> GetMethodAttributes(MethodInfo method)
            {
                return method
                    .GetCustomAttributes<TAttr>()
                    .Select(attr => new Tuple<MethodInfo, TAttr>(method, attr));
            }

            Type GetDelegateType(MethodInfo mi)
            {
                var types2 = mi.GetParameters()
                    .Select(p => p.ParameterType)
                    .Concat(new[] { mi.ReturnType });

                return Expression.GetDelegateType(types2.ToArray());
            }

            (TAttr Meta, TDelegate Method, PluginBase plugin) GetPluginMethodInfo(Tuple<MethodInfo, TAttr> obj)
            {
                var delegateType = typeof(TDelegate);

                if (delegateType == typeof(Delegate))
                {
                    delegateType = GetDelegateType(obj.Item1);
                }

                var mthodDelegate = obj.Item1.IsStatic
                    ? obj.Item1.CreateDelegate(delegateType)
                    : obj.Item1.CreateDelegate(delegateType, plugin);

                return (obj.Item2, mthodDelegate as TDelegate, plugin);
            }

            return plugin
                .GetType()
                .GetTypeInfo()
                .GetMethods()
                .SelectMany(GetMethodAttributes)
                .Select(GetPluginMethodInfo)
                .ToArray();
        }

        #endregion

        #region to object registry

        public static ObjectRegistry<T> ToObjectRegistry<T, T2>(
            this IEnumerable<T2> collection, Func<T2, string> getKey, Func<T2, T> getValue)
        {
            var registry = new ObjectRegistry<T>();

            return collection.ToObjectRegistry(registry, getKey, getValue);
        }

        public static ObjectRegistry<T> ToObjectRegistry<T, T2>(
            this IEnumerable<T2> collection, ObjectRegistry<T> registry, Func<T2, string> getKey, Func<T2, T> getValue)
        {
            foreach (var item in collection)
            {
                var key = getKey(item);
                var value = getValue(item);
                registry.Register(key, value);
            }

            return registry;
        }

        #endregion

        #region to object set registry

        public static ObjectSetRegistry<T> ToObjectSetRegistry<T, T2>(
            this IEnumerable<T2> collection, Func<T2, string> getKey, Func<T2, T> getValue)
        {
            var registry = new ObjectSetRegistry<T>();

            return collection.ToObjectSetRegistry(registry, getKey, getValue);
        }

        public static ObjectSetRegistry<T> ToObjectSetRegistry<T, T2>(
            this IEnumerable<T2> collection, ObjectSetRegistry<T> registry, Func<T2, string> getKey, Func<T2, T> getValue)
        {
            foreach (var item in collection)
            {
                var key = getKey(item);
                var value = getValue(item);
                registry.Register(key, value);
            }

            return registry;
        }

        #endregion
    }
}
