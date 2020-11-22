using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public abstract class HttpResourceAttribute : Attribute
    {
        protected HttpResourceAttribute(string url)
        {
            Url = url;
        }

        public string Url { get; }
    }
}
