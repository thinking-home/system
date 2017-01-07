using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer
{
    public class PluginApiMiddleware
    {
        private readonly RequestDelegate next;

        public PluginApiMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            await context.Response.WriteAsync("<h1>Hello World</h1>");
            await next.Invoke(context);
        }
    }
}