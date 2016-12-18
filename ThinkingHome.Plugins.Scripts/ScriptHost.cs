using System;
using NLog;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts
{
    public class ScriptHost
    {
        private readonly InternalDictionary<Delegate> methods;
        private readonly Logger logger;
        private readonly Action<string, object[]> scriptRunner;

        public ScriptHost(InternalDictionary<Delegate> methods, Logger logger, Action<string, object[]> scriptRunner)
        {
            this.methods = methods;
            this.logger = logger;
            this.scriptRunner = scriptRunner;
        }

        // ReSharper disable once InconsistentNaming
        public void logInfo(object message, params object[] args)
        {
            logger.Log(LogLevel.Info, message.ToString(), args);
        }

        // ReSharper disable once InconsistentNaming
        public void logError(object message, params object[] args)
        {
            logger.Log(LogLevel.Error, message.ToString(), args);
        }

        // ReSharper disable once InconsistentNaming
        public object executeMethod(string method, params object[] args)
        {
            return methods[method].DynamicInvoke(args);
        }

        // ReSharper disable once InconsistentNaming
        public void executeScript(string name, params object[] args)
        {
            scriptRunner(name, args);
        }
    }
}