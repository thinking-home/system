using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace ThinkingHome.Core.Plugins.Utils
{
    public abstract class Handlers<TObject, TData>
    {
        protected readonly ConcurrentDictionary<string, TData> dic =
            new ConcurrentDictionary<string, TData>(StringComparer.CurrentCultureIgnoreCase);

        protected abstract TData Add(string key, TObject obj);

        protected abstract TData Update(string key, TData data, TObject obj);

        protected abstract void ExecuteInternal(TData data, Action<TObject> fn);

        public void Register(string key, TObject obj)
        {
            if (string.IsNullOrWhiteSpace(key) || obj == null)
            {
                return;
            }

            dic.AddOrUpdate(key, k => Add(k, obj), (k, set) => Update(k, set, obj));
        }

        public bool ContainsKey(string key) => dic.ContainsKey(key);

        public void Execute(string key, Action<TObject> fn) => ExecuteInternal(dic[key], fn);
    }

    public class HandlerSet<T> : Handlers<T, HashSet<T>>
    {
        protected override HashSet<T> Add(string key, T obj)
        {
            return new HashSet<T> {obj};
        }

        protected override HashSet<T> Update(string key, HashSet<T> data, T obj)
        {
            data.Add(obj);
            return data;
        }

        protected override void ExecuteInternal(HashSet<T> data, Action<T> fn)
        {
            foreach (var obj in data)
            {
                fn(obj);
            }
        }
    }

    public class InternalDictionary<T> : Handlers<T, T>
    {
        protected override T Add(string key, T obj) => obj;

        protected override T Update(string key, T data, T obj) => throw new Exception($"duplicated key {key} ({obj})");

        public T this[string key] => dic[key];

        protected override void ExecuteInternal(T data, Action<T> fn)
        {
            fn(data);
        }
    }
}