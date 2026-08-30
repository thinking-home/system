using System;
using System.Collections.Generic;
using Jint;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptContext
    {
        // create new engine for each script because engine isn't thread safe
        private readonly Engine engine;

        private readonly string name;
        private readonly string body;
        private readonly ILogger logger;

        public ScriptContext(string name, string body, object host, ILogger logger, TimeSpan timeout)
        {
            this.name = name;
            this.body = body;
            this.logger = logger;

            // таймаут прерывает зависший скрипт (например, с бесконечным циклом),
            // который иначе навсегда занял бы поток из пула
            engine = timeout > TimeSpan.Zero
                ? new Engine(options => options.TimeoutInterval(timeout))
                : new Engine();

            engine.SetValue("host", host);
        }

        public object Execute(params object[] args) => Execute(null, args);

        internal object Execute(IReadOnlyDictionary<string, string> meta, object args)
        {
            lock (engine)
            {
                try
                {
                    var metaScriptValue = SetVariable("meta", meta);
                    var argsScriptValue = SetVariable("args", args);

                    string code = $"(function(){{const meta={metaScriptValue};const args={argsScriptValue};{body}}}).call(this);";

                    return engine.Evaluate(code).ToObject();
                }
                catch (Exception ex)
                {
                    var displayName = string.IsNullOrEmpty(name) ? "unnamed script" : $"script \"{name}\"";
                    logger.LogError(new EventId(), ex, $"Can't execute {displayName}");

                    return null;
                }
            }
        }

        // помещает значение в переменную engine со случайным именем и возвращает
        // выражение для чтения этого значения из кода сценария
        private string SetVariable(string prefix, object value)
        {
            if (value == null) return "undefined";

            var variable = $"{prefix}_{Guid.NewGuid():N}";
            engine.SetValue(variable, value);

            return variable;
        }
    }
}
