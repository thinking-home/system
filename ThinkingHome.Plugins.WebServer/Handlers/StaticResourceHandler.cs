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

        public StaticResourceHandler(string resourcePath, string contentType, Assembly assembly) : base(true)
        {
            if (string.IsNullOrWhiteSpace(contentType)) throw new ArgumentNullException(nameof(contentType));
            if (string.IsNullOrWhiteSpace(resourcePath)) throw new ArgumentNullException(nameof(resourcePath));

            this.contentType = contentType;
            this.resourcePath = resourcePath;
            this.assembly = assembly ?? throw new ArgumentNullException(nameof(assembly));
        }

        public override async Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            await using var stream = assembly.GetManifestResourceStream(resourcePath);

            if (stream != null) {
                var result = new byte[stream.Length];
                await stream.ReadAsync(result, 0, result.Length);
                return HttpHandlerResult.Binary(result, contentType);
            }

            throw new MissingManifestResourceException($"resource {resourcePath} is not found");
        }
    }
}
