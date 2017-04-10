using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public abstract class HttpDynamicResourceAttribute : HttpResourceAttribute
    {
        protected HttpDynamicResourceAttribute(string url, string contentType, bool isCached = false)
            :base(url, contentType, isCached)
        {
        }

        public abstract byte[] GetContent(object methodResult);
    }
}