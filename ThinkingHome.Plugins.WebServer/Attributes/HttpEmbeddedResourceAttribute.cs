using System.Reflection;
using System.Resources;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpEmbeddedResourceAttribute : HttpResourceAttribute
    {
        public string ResourcePath { get; }

        public HttpEmbeddedResourceAttribute(string url, string resourcePath, string contentType = "text/plain")
            :base(url, contentType, true)
        {
            ResourcePath = resourcePath;
        }

        public byte[] GetContent(Assembly assembly)
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
                    var message = string.Format("resource {0} is not found", ResourcePath);
                    throw new MissingManifestResourceException(message);
                }
            }

            return result;
        }
    }
}