using System;
using Jint;
using NLog;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptContext
    {
        private readonly string name;
        private readonly string body;
        private readonly Engine engine;
        private readonly Logger logger;

        public ScriptContext(string name, string body, Engine engine, Logger logger)
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
                var id = string.IsNullOrEmpty(name) ? $"script \"{name}\"" : "unnamed script";
                logger.Error(ex, $"Can't execute {id}");

                return null;
            }
        }
    }
}