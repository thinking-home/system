using System;
using System.Collections.Generic;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts.Events
{
    public class ScriptEventsConfigurationBuilder(
        Type source,
        ObjectRegistry<ScriptEventDefinition> items,
        Action<ScriptEventDefinition, object, IReadOnlyDictionary<string, string>> emit)
        : BaseConfigurationBuilder<ScriptEventDefinition>(source, items)
    {
        /// <summary>
        /// Зарегистрировать сценарное событие без параметров. Возвращает функцию,
        /// инициирующую событие; она валидна после завершения фазы инициализации плагинов.
        /// </summary>
        public ScriptEventEmitter RegisterEvent(string name)
        {
            var definition = Register(name, null);

            return meta => emit(definition, null, meta);
        }

        /// <summary>
        /// Зарегистрировать сценарное событие, в обработчики которого владелец
        /// передает параметры типа <typeparamref name="TArgs"/>.
        /// </summary>
        public ScriptEventEmitter<TArgs> RegisterEvent<TArgs>(string name)
        {
            var definition = Register(name, typeof(TArgs));

            return (parameters, meta) => emit(definition, parameters, meta);
        }

        private ScriptEventDefinition Register(string name, Type argsType)
        {
            // реестр молча игнорирует пустые ключи — проверяем явно, чтобы
            // не вернуть emitter незарегистрированного события
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentException("Script event name must be a non-empty string", nameof(name));
            }

            var definition = new ScriptEventDefinition(name, Source, argsType);

            RegisterItem(name, definition);

            return definition;
        }
    }
}
