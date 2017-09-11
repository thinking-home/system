using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class InternalDictionary<T>
        where T : class
    {
        private ConcurrentDictionary<string, T> _dictionary;

        private readonly object lockObject = new object();

        public InternalDictionary()
        {
            _dictionary = new ConcurrentDictionary<string, T>(StringComparer.CurrentCultureIgnoreCase);
        }

        public void Register(string key, T obj)
        {
            if (obj == null) throw new ArgumentNullException(nameof(obj));
            if (string.IsNullOrWhiteSpace(key)) throw new ArgumentNullException(nameof(key));

            _dictionary.AddOrUpdate(key, obj, (k, v) => obj);
        }

        public T this[string key]
        {
            get
            {
                return _dictionary[key];
            }
        }

        public bool ContainsKey(string key)
        {
            return _dictionary.ContainsKey(key);
        }
    }
}