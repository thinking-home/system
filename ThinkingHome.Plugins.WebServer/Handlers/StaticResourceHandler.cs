using System;
using System.Reflection;
using System.Resources;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class StaticResourceHandler : BaseHandler
    {
        private readonly Assembly assembly;
        private readonly string contentType;
        private readonly string resourcePath;

        public StaticResourceHandler(Type source, string resourcePath, string contentType, Assembly assembly = null) : base(source, true)
        {
            if (string.IsNullOrWhiteSpace(contentType)) throw new ArgumentNullException(nameof(contentType));
            if (string.IsNullOrWhiteSpace(resourcePath)) throw new ArgumentNullException(nameof(resourcePath));

            this.contentType = contentType;
            this.resourcePath = resourcePath;
            this.assembly = assembly ?? source.Assembly;
        }

        public override async Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            await using var stream = assembly.GetManifestResourceStream(resourcePath);

            if (stream == null) throw new MissingManifestResourceException($"resource {resourcePath} is not found");
            
            var result = new byte[stream.Length];
            await stream.ReadAsync(result, 0, result.Length);
            return HttpHandlerResult.Binary(result, contentType);
        }
    }
}
