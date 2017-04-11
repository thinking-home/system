using System.Text;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class HttpJsonDynamicResourceAttribute : HttpDynamicResourceAttribute
    {
        public HttpJsonDynamicResourceAttribute(string url) : base(url, "application/json;charset=utf-8")
        {
        }

        public override byte[] PrepareResult(object methodResult)
        {
            var json = methodResult.ToJson("null");
            return Encoding.UTF8.GetBytes(json);
        }
    }
}