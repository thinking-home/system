using NLog;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptLogger
    {
        private readonly Logger logger;

        public ScriptLogger(Logger logger)
        {
            this.logger = logger;
        }

        // ReSharper disable once InconsistentNaming
        public void trace(object msg, params object[] args) => WriteLog(LogLevel.Trace, msg, args);

        // ReSharper disable once InconsistentNaming
        public void debug(object msg, params object[] args) => WriteLog(LogLevel.Debug, msg, args);

        // ReSharper disable once InconsistentNaming
        public void info(object msg, params object[] args) => WriteLog(LogLevel.Info, msg, args);

        // ReSharper disable once InconsistentNaming
        public void warn(object msg, params object[] args) => WriteLog(LogLevel.Warn, msg, args);

        // ReSharper disable once InconsistentNaming
        public void error(object msg, params object[] args) => WriteLog(LogLevel.Error, msg, args);

        // ReSharper disable once InconsistentNaming
        public void fatal(object msg, params object[] args) => WriteLog(LogLevel.Fatal, msg, args);

        private void WriteLog(LogLevel level, object msg, object[] args)
        {
            logger.Log(level, msg?.ToString(), args);
        }
    }
}