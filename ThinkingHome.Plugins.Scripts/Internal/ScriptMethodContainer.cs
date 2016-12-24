using System;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    /// <summary>
    /// Контейнер, организующий доступ к сценарным методам по имени
    /// </summary>
    /// <typeparam name="T">Тип сценарного метода (делегат)</typeparam>
    public class ScriptMethodContainer<T>
    {
        private readonly Func<string, T> resolver;

        /// <param name="resolver">Функция, возвращающая правильный делегат по его имени</param>
        public ScriptMethodContainer(Func<string, T> resolver)
        {
            this.resolver = resolver;
        }

        public T this[string name] => resolver(name);
    }
}