using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class ApiHttpHandler : IHttpHandler
    {
        private static readonly Encoding utf8 = Encoding.UTF8;

        private readonly HttpHandlerDelegate method;

        public ApiHttpHandler(HttpHandlerDelegate method)
        {
            if (method == null) throw new NullReferenceException();

            this.method = method;
        }

        public async Task ProcessRequest(HttpContext context, IMemoryCache cache)
        {
            var parameters = new HttpRequestParams(context.Request);
            var result = await Task.Run(() => method(parameters));
            var json = result.ToJson("null");

            var response = context.Response;

            response.Headers["Cache-Control"] = "no-cache, no-store";
            response.ContentType = "application/json;charset=utf-8";
            response.ContentLength = utf8.GetByteCount(json);

            await response.WriteAsync(json, utf8);
        }
    }
}
