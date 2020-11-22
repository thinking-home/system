using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    /// <summary>
    /// Статический HTTP ресурс (кэшируется)
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public abstract class HttpEmbeddedResourceAttribute : HttpResourceAttribute
    {
        public string ResourcePath { get; }

        public string ContentType { get; }

        protected HttpEmbeddedResourceAttribute(string url, string resourcePath, string contentType = "text/plain")
            : base(url)
        {
            ContentType = contentType;
            ResourcePath = resourcePath;
        }
    }
}
