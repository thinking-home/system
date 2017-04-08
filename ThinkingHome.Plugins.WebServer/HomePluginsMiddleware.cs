using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer
{
    public class HomePluginsMiddleware
    {
        private readonly RequestDelegate next;
        private readonly InternalDictionary<IHttpHandler> handlers;
        private readonly ILogger logger;
        private readonly IMemoryCache cache;

        public HomePluginsMiddleware(InternalDictionary<IHttpHandler> handlers, RequestDelegate next, ILoggerFactory loggerFactory, IMemoryCache cache)
        {
            this.next = next;
            this.handlers = handlers;
            this.logger = loggerFactory.CreateLogger(GetType());
            this.cache = cache;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.Value;

            if (handlers.ContainsKey(path))
            {
                logger.LogInformation($"invoke http handler: {path};");

                try
                {
                    await handlers[path].ProcessRequest(context, cache);
                }
                catch (Exception ex)
                {
                    logger.LogInformation(0, ex, $"http handler error: {path}");
                    context.Response.StatusCode = 500;
                }
            }
            else
            {
                await next.Invoke(context);
            }
        }
    }
}
