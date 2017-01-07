using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class ApiHttpHandler : IHttpHandler
    {
        private readonly HttpHandlerDelegate method;

        public ApiHttpHandler(HttpHandlerDelegate method)
        {
            if (method == null) throw new NullReferenceException();

            this.method = method;
        }

        public Task ProcessRequest(HttpContext context)
        {
            throw new System.NotImplementedException();
        }
    }
}