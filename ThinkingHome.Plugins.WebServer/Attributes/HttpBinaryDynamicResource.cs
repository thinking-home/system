using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpBinaryDynamicResource : HttpDynamicResourceAttribute
    {
        public HttpBinaryDynamicResource(string url, string contentType = "application/octet-stream")
            :base(url, contentType)
        {
        }

        public override byte[] GetContent(object methodResult)
        {
            return methodResult as byte[];
        }
    }
}