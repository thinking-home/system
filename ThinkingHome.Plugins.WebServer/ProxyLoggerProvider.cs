using Microsoft.Extensions.Logging;

namespace ThinkingHome.Plugins.WebServer
{
    public class ProxyLoggerProvider : ILoggerProvider
    {
        private readonly ILogger logger;

        public ProxyLoggerProvider(ILogger logger)
        {
            this.logger = logger;
        }

        public ILogger CreateLogger(string categoryName)
        {
            return logger;
        }

        public void Dispose()
        {

        }
    }

    public static class ProxyLoggerProviderExtensions
    {
        public static ILoggerFactory AddProxy(this ILoggerFactory factory, ILogger logger)
        {
            factory.AddProvider(new ProxyLoggerProvider(logger));
            return factory;
        }
    }
}
