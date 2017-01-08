using System;
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
    }
}
