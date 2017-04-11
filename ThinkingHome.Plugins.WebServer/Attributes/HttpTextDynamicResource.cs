using System.Text;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpTextDynamicResource : HttpDynamicResourceAttribute
    {
        public HttpTextDynamicResource(string url, string contentType = "text/plain")
            :base(url, contentType)
        {
        }

        public override byte[] PrepareResult(object methodResult)
        {
            var text = methodResult?.ToString();
            return Encoding.UTF8.GetBytes(text);
        }
    }
}