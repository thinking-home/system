using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    [AttributeUsage(AttributeTargets.Method)]
    public class HttpCommandAttribute : Attribute
    {
        public string Url { get; }

        public HttpCommandAttribute(string url)
        {
            Url = url;
        }
    }
}
