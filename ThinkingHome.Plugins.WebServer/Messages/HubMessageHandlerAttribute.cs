using System;

namespace ThinkingHome.Plugins.WebServer.Messages
{
    [AttributeUsage(AttributeTargets.Method)]
    public class HubMessageHandlerAttribute : Attribute
    {
        public string Topic { get; }

        public HubMessageHandlerAttribute(string topic)
        {
            Topic = topic;
        }
    }
}
