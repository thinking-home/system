using System;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public class HttpLocalizationResourceAttribute : HttpResourceAttribute
    {
        public HttpLocalizationResourceAttribute(string url)
            : base(url, "application/json;charset=utf-8", false)
        {
        }
    }
}