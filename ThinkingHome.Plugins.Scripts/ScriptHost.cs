using System;
using System.Linq;
using System.Reflection;
using NLog;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.Scripts
{
    public class ScriptHost
    {
        private readonly InternalDictionary<Delegate> methods;
        private readonly Logger logger;
        private readonly Func<string, object[], object> scriptRunner;

        public Delegate this[string name]
        {
            get {
                logger.Debug($"execute method: {name}");
                return methods[name];
            }
        }

    public ScriptHost(InternalDictionary<Delegate> methods, Logger logger, Func<string, object[], object> scriptRunner)
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
            logger.Debug($"execute method: {method}");
            return methods[method].DynamicInvoke(args);
        }

        // ReSharper disable once InconsistentNaming
        public object executeScript(string name, params object[] args)
        {
            return scriptRunner(name, args);
        }
    }
}