using System;
using Jint;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptContext
    {
        // create new engine for each script because engine isn't thread safe
        private readonly Engine engine = new Engine();
        
        private readonly string name;
        private readonly string body;
        private readonly ILogger logger;

        public ScriptContext(string name, string body, object host, ILogger logger)
        {
            this.name = name;
            this.body = body;
            this.logger = logger;
            
            engine.SetValue("host", host);
        }

        public object Execute(params object[] args)
        {
            lock (engine)
            {
                try
                {
                    var argumentsVariable = $"args_{Guid.NewGuid():N}";
                    
                    engine.SetValue(argumentsVariable, args);
                    
                    string code =  $"(function(){{{body}}}).apply(this,{argumentsVariable});";

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
}
