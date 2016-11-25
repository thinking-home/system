using System.Collections.Generic;
using System.Linq;
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

        public static IEnumerable<T> FilterByType<T>(this IEnumerable<PluginBase> collection) where T : class
        {
            return collection.Where(obj => obj is T).Cast<T>();
        }
    }
}