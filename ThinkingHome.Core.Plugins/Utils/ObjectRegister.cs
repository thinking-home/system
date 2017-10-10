using System;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class ObjectRegister<T> : BaseRegister<T, T>
    {
        protected override T Add(string key, T value) => value;

        protected override T Update(string key, T data, T value) => throw new Exception($"duplicated key {key} ({value})");
    }
}
