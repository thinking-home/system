using Microsoft.Extensions.Logging;

namespace ThinkingHome.Plugins.Scripts.Internal
{
    public class ScriptLogger
    {
        private readonly ILogger logger;

        public ScriptLogger(ILogger logger)
        {
            this.logger = logger;
        }

        // ReSharper disable once InconsistentNaming
        public void trace(object msg, params object[] args) => logger.LogTrace(msg?.ToString(), args);

        // ReSharper disable once InconsistentNaming
        public void debug(object msg, params object[] args) => logger.LogDebug(msg?.ToString(), args);

        // ReSharper disable once InconsistentNaming
        public void info(object msg, params object[] args) => logger.LogInformation(msg?.ToString(), args);

        // ReSharper disable once InconsistentNaming
        public void warn(object msg, params object[] args) => logger.LogWarning(msg?.ToString(), args);

        // ReSharper disable once InconsistentNaming
        public void error(object msg, params object[] args) => logger.LogError(msg?.ToString(), args);

        // ReSharper disable once InconsistentNaming
        public void fatal(object msg, params object[] args) => logger.LogCritical(msg?.ToString(), args);
    }
}
