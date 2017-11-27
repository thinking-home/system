using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class DynamicResourceHandler :BaseHandler<HttpDynamicResourceAttribute>
    {
        private readonly HttpHandlerDelegate method;

        public DynamicResourceHandler(HttpHandlerDelegate method, HttpDynamicResourceAttribute resource)
            :base(resource)
        {
            this.method = method ?? throw new ArgumentNullException(nameof(method));
        }

        public override async Task<byte[]> GetContent(HttpContext context)
        {
            var parameters = new HttpRequestParams(context.Request);

            return await Task.Run(() => Resource.PrepareResult(method(parameters)));
        }
    }
}
