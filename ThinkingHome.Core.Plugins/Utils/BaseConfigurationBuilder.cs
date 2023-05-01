using System;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class BaseConfigurationBuilder<T> : IDisposable
    {
        private bool disposed;
        private readonly ObjectRegistry<T> items;

        protected readonly Type Source;

        protected BaseConfigurationBuilder(Type source, ObjectRegistry<T> items)
        {
            Source = source;
            this.items = items;
        }

        public void Dispose()
        {
            disposed = true;
        }

        protected void RegisterItem(string key, T item)
        {
            EnsureState();

            items.Register(key, item);
        }
        
        protected void EnsureState()
        {
            if (disposed) {
                throw new InvalidOperationException("Can't add item into disposed registry");
            }
        }
    }
}
