using System;

namespace ThinkingHome.Plugins.WebServer.Attributes.Base
{
    public abstract class HttpResourceAttribute : Attribute
    {
        protected HttpResourceAttribute(string url, string contentType, bool isCached)
        {
            Url = url;
            ContentType = contentType;
            IsCached = isCached;
        }

        public string Url { get; }

        public string ContentType { get; }

        public bool IsCached { get; set; }
    }
}