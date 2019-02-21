using System.Reflection;
using System.Resources;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpEmbeddedResourceAttribute : HttpStaticResourceAttribute
    {
        public string ResourcePath { get; }

        public HttpEmbeddedResourceAttribute(string url, string resourcePath, string contentType = "text/plain")
            :base(url, contentType)
        {
            ResourcePath = resourcePath;
        }

        public override byte[] GetContent(Assembly assembly)
        {
            byte[] result;

            using (var stream = assembly.GetManifestResourceStream(ResourcePath))
            {
                if (stream != null)
                {
                    result = new byte[stream.Length];
                    stream.Read(result, 0, result.Length);
                }
                else
                {
                    var message = $"resource {ResourcePath} is not found";
                    throw new MissingManifestResourceException(message);
                }
            }

            return result;
        }
    }
}