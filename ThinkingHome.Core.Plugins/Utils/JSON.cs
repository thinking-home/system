using Newtonsoft.Json;

namespace ThinkingHome.Core.Plugins.Utils
{
    public static class JSON
    {
        /// <summary>
        /// Десериализация
        /// </summary>
        public static T Parse<T>(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }

        /// <summary>
        /// Десериализация
        /// </summary>
        public static dynamic Parse(string json)
        {
            return JsonConvert.DeserializeObject(json);
        }

        /// <summary>
        /// Сериализация в JSON
        /// </summary>
        public static string Stringify(object obj, string defaultValue = "")
        {
            return obj == null ? defaultValue : JsonConvert.SerializeObject(obj);
        }

        /// <summary>
        /// Сериализация в JSON
        /// </summary>
        public static string ToJson(this object obj, string defaultValue = "")
        {
            return Stringify(obj, defaultValue);
        }
    }
}
