using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace ThinkingHome.Core.Plugins.Utils
{
    /// <summary>
    /// Thread safe dictionary with empty elements filter
    /// </summary>
    /// <typeparam name="TValue"></typeparam>
    /// <typeparam name="TData"></typeparam>
    public abstract class BaseRegister<TValue, TData>
    {
        private readonly ConcurrentDictionary<string, TData> data =
            new ConcurrentDictionary<string, TData>(StringComparer.CurrentCultureIgnoreCase);

        protected abstract TData Add(string key, TValue value);

        protected abstract TData Update(string key, TData data, TValue value);

        public void Register(string key, TValue value)
        {
            if (string.IsNullOrWhiteSpace(key) || value == null)
            {
                return;
            }

            data.AddOrUpdate(key, k => Add(k, value), (k, set) => Update(k, set, value));
        }

        public bool ContainsKey(string key) => data.ContainsKey(key);

        public TData this[string key] => data[key];

        public ReadOnlyDictionary<string, TData> Data => new ReadOnlyDictionary<string, TData>(data);
    }
}
