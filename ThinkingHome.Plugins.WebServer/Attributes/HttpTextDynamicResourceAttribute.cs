using System.Text;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpTextDynamicResourceAttribute : HttpDynamicResourceAttribute
    {
        public HttpTextDynamicResourceAttribute(string url, string contentType = "text/plain")
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