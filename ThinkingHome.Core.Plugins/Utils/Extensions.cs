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

        /// <summary>
        /// Получить тип делегата для заданного метода
        /// </summary>
        public static Type GetDelegateType(this MethodInfo mi)
        {
            var types2 = mi.GetParameters()
                .Select(p => p.ParameterType)
                .Concat(new[] { mi.ReturnType });

            return Expression.GetDelegateType(types2.ToArray());
        }

        #region parse

        public static int? ParseInt(this string stringValue)
        {
            int result;

            if (int.TryParse(stringValue, out result))
            {
                return result;
            }

            return null;
        }

        public static Guid? ParseGuid(this string stringValue)
        {
            Guid result;

            if (Guid.TryParse(stringValue, out result))
            {
                return result;
            }

            return null;
        }

        public static bool? ParseBool(this string stringValue)
        {
            bool result;

            if (bool.TryParse(stringValue, out result))
            {
                return result;
            }

            return null;
        }

        #endregion

        #region handlers

        public static PluginMethodInfo<TAttr, TDelegate>[] FindMethods<TAttr, TDelegate>(
            this IEnumerable<PluginBase> plugins) where TAttr: Attribute where TDelegate : class
        {
            return plugins
                .SelectMany(p => p.FindMethods<TAttr, TDelegate>())
                .ToArray();
        }

        public static PluginMethodInfo<TAttr, TDelegate>[] FindMethods<TAttr, TDelegate>(this PluginBase plugin)
            where TAttr: Attribute where TDelegate : class
        {
            IEnumerable<Tuple<MethodInfo, TAttr>> GetMethodAttributes(MethodInfo method)
            {
                return method
                    .GetCustomAttributes<TAttr>()
                    .Select(attr => new Tuple<MethodInfo, TAttr>(method, attr));
            }

            PluginMethodInfo<TAttr, TDelegate> GetPluginMethodInfo(Tuple<MethodInfo, TAttr> obj)
            {
                var delegateType = typeof(TDelegate);

                if (delegateType == typeof(Delegate))
                {
                    delegateType = obj.Item1.GetDelegateType();
                }

                var mthodDelegate = obj.Item1.IsStatic
                    ? obj.Item1.CreateDelegate(delegateType)
                    : obj.Item1.CreateDelegate(delegateType, plugin);

                return new PluginMethodInfo<TAttr, TDelegate>(obj.Item2, mthodDelegate as TDelegate);
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
    }
}
