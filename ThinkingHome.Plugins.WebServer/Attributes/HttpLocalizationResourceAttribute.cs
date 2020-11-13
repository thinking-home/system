using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class HttpLocalizationResourceAttribute : HttpResourceAttribute
    {
        public HttpLocalizationResourceAttribute(string url) : base(url)
        {
        }
    }
}
