using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    /// <summary>
    /// HTTP ресурс с динамически формируемым содержимым (не кэшируется)
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public class HttpDynamicResourceAttribute : HttpResourceAttribute
    {
        public HttpDynamicResourceAttribute(string url) : base(url)
        {
        }
    }
}
