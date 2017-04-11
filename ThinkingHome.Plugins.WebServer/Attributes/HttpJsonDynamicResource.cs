using System.Text;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpJsonDynamicResource : HttpDynamicResourceAttribute
    {
        public HttpJsonDynamicResource(string url) : base(url, "application/json;charset=utf-8")
        {
        }

        public override byte[] GetContent(object methodResult)
        {
            var json = methodResult.ToJson("null");
            return Encoding.UTF8.GetBytes(json);
        }
    }
}