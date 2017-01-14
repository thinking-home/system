using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class ResourceHttpHandler : IHttpHandler
    {
        private readonly Assembly assembly;
        private readonly HttpResourceAttribute resource;

        public ResourceHttpHandler(Assembly assembly, HttpResourceAttribute resource)
        {
            this.assembly = assembly;
            this.resource = resource;
        }

        public async Task ProcessRequest(HttpContext context)
        {
            byte[] data = GetResourceData();

            context.Response.ContentType = resource.ContentType;
            context.Response.ContentLength = data.Length;

            await context.Response.Body.WriteAsync(data, 0, data.Length);
        }

        private byte[] GetResourceData()
        {
            return resource.GetContent(assembly);
        }
    }
}