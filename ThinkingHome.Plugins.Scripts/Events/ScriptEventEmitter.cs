using System.Collections.Generic;

namespace ThinkingHome.Plugins.Scripts.Events
{
    /// <summary>
    /// Инициирует событие без параметров.
    /// </summary>
    public delegate void ScriptEventEmitter(IReadOnlyDictionary<string, string> meta = null);

    /// <summary>
    /// Инициирует событие с параметрами типа <typeparamref name="TArgs"/>.
    /// </summary>
    public delegate void ScriptEventEmitter<in TArgs>(TArgs parameters, IReadOnlyDictionary<string, string> meta = null);
}
