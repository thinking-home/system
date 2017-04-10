using System;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class StaticResourceHandler : BaseHandler<HttpStaticResourceAttribute>
    {
        private readonly Assembly assembly;

        public StaticResourceHandler(Assembly assembly, HttpStaticResourceAttribute resource)
            :base(resource)
        {
            if (assembly == null) throw new ArgumentNullException(nameof(assembly));

            this.assembly = assembly;
        }

        public override async Task<byte[]> GetContent(HttpContext context)
        {
            return await Task.Run(() => Resource.GetContent(assembly));
        }
    }
}