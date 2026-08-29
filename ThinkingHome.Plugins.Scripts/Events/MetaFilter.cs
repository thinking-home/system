using System;
using System.Collections.Generic;
using System.Linq;

namespace ThinkingHome.Plugins.Scripts.Events
{
    /// <summary>
    /// Фильтр подписки по значениям словаря meta. Хранится в виде строки в формате
    /// query string ("key1=value1&amp;key2=value2", ключи и значения URL-кодируются).
    /// Подписка срабатывает, если каждая пара фильтра присутствует в meta события
    /// (сравнение строк без учета культуры, с учетом регистра). Пустой фильтр
    /// пропускает любые события.
    /// </summary>
    public static class MetaFilter
    {
        public static string Serialize(IReadOnlyDictionary<string, string> values)
        {
            if (values == null || values.Count == 0) return string.Empty;

            // сортировка дает канонический вид: одинаковые фильтры равны как строки
            return string.Join("&", values
                .OrderBy(pair => pair.Key, StringComparer.Ordinal)
                .Select(pair => $"{Uri.EscapeDataString(pair.Key)}={Uri.EscapeDataString(pair.Value ?? string.Empty)}"));
        }

        public static Dictionary<string, string> Parse(string filter)
        {
            var values = new Dictionary<string, string>(StringComparer.Ordinal);

            if (string.IsNullOrWhiteSpace(filter)) return values;

            foreach (var pair in filter.Split('&', StringSplitOptions.RemoveEmptyEntries))
            {
                var index = pair.IndexOf('=');

                var key = index < 0 ? pair : pair.Substring(0, index);
                var value = index < 0 ? string.Empty : pair.Substring(index + 1);

                values[Uri.UnescapeDataString(key)] = Uri.UnescapeDataString(value);
            }

            return values;
        }

        public static bool IsMatch(string filter, IReadOnlyDictionary<string, string> meta)
        {
            var values = Parse(filter);

            if (values.Count == 0) return true;
            if (meta == null) return false;

            return values.All(pair =>
                meta.TryGetValue(pair.Key, out var value) &&
                string.Equals(pair.Value, value, StringComparison.Ordinal));
        }
    }
}
