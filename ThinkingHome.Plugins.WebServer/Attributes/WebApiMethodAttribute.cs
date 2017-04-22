namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class WebApiMethodAttribute : HttpJsonDynamicResourceAttribute
    {
        public WebApiMethodAttribute(string url) : base(url)
        {
        }
    }
}