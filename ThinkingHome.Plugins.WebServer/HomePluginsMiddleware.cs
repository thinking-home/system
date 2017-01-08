using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using NLog;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer
{
    public class HomePluginsMiddleware
    {
        private readonly RequestDelegate next;
        private readonly HttpHandlerSet handlers;
        private readonly Logger logger;

        public HomePluginsMiddleware(RequestDelegate next, HttpHandlerSet handlers, Logger logger)
        {
            this.next = next;
            this.handlers = handlers;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.Value;

            if (handlers.ContainsKey(path))
            {
                logger.Info($"invoke http handler: {path};");

                try
                {
                    await handlers[path].ProcessRequest(context);
                }
                catch (Exception ex)
                {
                    logger.Error(ex, $"http handler error: {path}");
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
