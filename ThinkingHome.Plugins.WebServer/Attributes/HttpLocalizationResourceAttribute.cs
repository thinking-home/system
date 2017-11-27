using System;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class HttpLocalizationResourceAttribute : HttpResourceAttribute
    {
        public readonly string BaseName;

        public HttpLocalizationResourceAttribute(string url, string baseName)
            : base(url, "application/json;charset=utf-8", false)
        {
            BaseName = baseName;
        }
    }
}