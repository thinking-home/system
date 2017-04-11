using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpBinaryDynamicResourceAttribute : HttpDynamicResourceAttribute
    {
        public HttpBinaryDynamicResourceAttribute(string url, string contentType = "application/octet-stream")
            :base(url, contentType)
        {
        }

        public override byte[] PrepareResult(object methodResult)
        {
            return methodResult as byte[];
        }
    }
}