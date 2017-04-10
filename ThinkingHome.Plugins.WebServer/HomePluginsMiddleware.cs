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
        // cache params
        private const int CACHE_EXPIRATION = 7200; // в секундах (7200 == 2 часа)

        private readonly RequestDelegate next;
        private readonly InternalDictionary<IHandler> handlers;
        private readonly ILogger logger;
        private readonly IMemoryCache cache;

        public HomePluginsMiddleware(InternalDictionary<IHandler> handlers, RequestDelegate next, ILoggerFactory loggerFactory, IMemoryCache cache)
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
                    var handler = handlers[path];

                    byte[] data;

                    if (handler.IsCached)
                    {
                        data = await cache.GetOrCreateAsync(handler.CacheKey, e =>
                        {
                            e.SetAbsoluteExpiration(TimeSpan.FromSeconds(CACHE_EXPIRATION));
                            return handler.GetContent(context);
                        });

                        context.Response.Headers["Cache-Control"] = $"private, max-age={CACHE_EXPIRATION}";
                    }
                    else
                    {
                        data = await handler.GetContent(context);
                        context.Response.Headers["Cache-Control"] = "no-cache, no-store";
                    }

                    context.Response.ContentType = handler.ContentType;
                    context.Response.ContentLength = data.Length;

                    await context.Response.Body.WriteAsync(data, 0, data.Length);
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
