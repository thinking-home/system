using System;

namespace ThinkingHome.Plugins.Scripts.Events
{
    /// <summary>
    /// Описание зарегистрированного сценарного события: имя, плагин-владелец
    /// и тип параметров, которые владелец передает в обработчики.
    /// </summary>
    public class ScriptEventDefinition(string name, Type source, Type argsType)
    {
        public readonly string Name = name;

        public readonly Type Source = source;

        /// <summary>null — событие без параметров</summary>
        public readonly Type ArgsType = argsType;
    }
}
