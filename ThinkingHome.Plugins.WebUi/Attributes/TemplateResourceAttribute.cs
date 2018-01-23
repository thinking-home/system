using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi.Attributes
{
    public class TemplateResourceAttribute : HttpEmbeddedResourceAttribute
    {
        public TemplateResourceAttribute(string url, string resourcePath) : base(url, resourcePath)
        {
        }
    }
}
