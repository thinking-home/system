using System;

namespace ThinkingHome.Plugins.WebServer.Attributes.Base
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public abstract class HttpDynamicResourceAttribute : HttpResourceAttribute
    {
        protected HttpDynamicResourceAttribute(string url, string contentType)
            :base(url, contentType, false)
        {
        }

        public abstract byte[] GetContent(object methodResult);
    }
}