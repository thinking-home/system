using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi.Attributes
{
    public class JavaScriptResourceAttribute : HttpEmbeddedResourceAttribute
    {
        public JavaScriptResourceAttribute(string url, string resourcePath)
            : base(url, resourcePath, "application/javascript")
        {
        }
    }
}