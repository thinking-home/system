using System;
using Jint;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptContext
    {
        private readonly string name;
        private readonly string body;
        private readonly Engine engine;
        private readonly ILogger logger;

        public ScriptContext(string name, string body, Engine engine, ILogger logger)
        {
            this.name = name;
            this.body = body;
            this.logger = logger;
            this.engine = engine;
        }

        public object Execute(params object[] args)
        {
            try
            {
                string json = args.ToJson("[]");
                string code =  $"(function(){{{body}}}).apply(this,{json});";

                return engine.Execute(code)
                    .GetCompletionValue()
                    .ToObject();
            }
            catch (Exception ex)
            {
                var displayName = string.IsNullOrEmpty(name) ? "unnamed script" : $"script \"{name}\"";
                logger.LogError(new EventId(), ex, $"Can't execute {displayName}");

                return null;
            }
        }
    }
}
