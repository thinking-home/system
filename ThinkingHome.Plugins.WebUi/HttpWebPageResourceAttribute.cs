using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi
{
    public class HttpWebPageResourceAttribute: HttpEmbeddedResourceAttribute
    {
        public HttpWebPageResourceAttribute(string url) : base(url, "ThinkingHome.Plugins.WebUi.Resources.index.html", "text/html")
        {
        }

        public override TargetAssembly Assembly => TargetAssembly.FromAttribute;
    }
}
