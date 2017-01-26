using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi.Attributes
{
    public class CssResourceAttribute : HttpEmbeddedResourceAttribute
    {
        public CssResourceAttribute(string url, string resourcePath)
            : base(url, resourcePath, "text/css")
        {
        }
    }
}