using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class DynamicResourceHandler : BaseHandler
    {
        private readonly HttpHandlerDelegate method;

        public DynamicResourceHandler(HttpHandlerDelegate method) : base(false)
        {
            this.method = method ?? throw new ArgumentNullException(nameof(method));
        }

        public override async Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            var parameters = new HttpRequestParams(context.Request);

            return await Task.Run(() => method(parameters));
        }
    }
}
