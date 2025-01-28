using System;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class ObjectRegistry<T> : BaseRegistry<T, T>
    {
        public ICollection<string> Keys => data.Keys;
        
        protected override T Add(string key, T value) => value;

        protected override T Update(string key, T data, T value) => throw new Exception($"duplicated key {key} ({value})");
    }
}
