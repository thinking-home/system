using System;
using System.Reflection;

namespace ThinkingHome.Plugins.WebServer.Attributes.Base
{
    /// <summary>
    /// Статический HTTP ресурс (кэшируется)
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public abstract class HttpStaticResourceAttribute : HttpResourceAttribute
    {
        protected HttpStaticResourceAttribute(string url, string contentType)
            :base(url, contentType, true)
        {
        }

        public abstract byte[] GetContent(Assembly assembly);
    }
}