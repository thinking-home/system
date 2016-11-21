using System;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class InternalDictionary<T> : Dictionary<string, T>
        where T : class
    {
        private readonly object lockObject = new object();

        public InternalDictionary()
            : base(StringComparer.CurrentCultureIgnoreCase)
        {
        }

        public void Register(string key, T obj)
        {
            if (string.IsNullOrWhiteSpace(key) || obj == null)
            {
                return;
            }

            lock (lockObject)
            {
                if (ContainsKey(key))
                {
                    throw new Exception($"duplicated key {key} ({obj})");
                }

                Add(key, obj);
            }
        }
    }
}