using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebUi.Attributes
{
    public class JavaScriptResourceAttribute : HttpEmbeddedResourceAttribute
    {
        public string Alias { get; set; }

        public JavaScriptResourceAttribute(string url, string resourcePath)
            : base(url, resourcePath, "application/javascript")
        {
        }

        public string GetClientUrl()
        {
            return string.IsNullOrEmpty(Alias) ? Url : Alias;
        }
    }
}