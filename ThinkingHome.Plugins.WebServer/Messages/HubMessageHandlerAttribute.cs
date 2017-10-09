using System;

namespace ThinkingHome.Plugins.WebServer.Messages
{
    [AttributeUsage(AttributeTargets.Method)]
    public class HubMessageHandlerAttribute : Attribute
    {
        public string Channel { get; }

        public HubMessageHandlerAttribute(string channel)
        {
            Channel = channel;
        }
    }

    public delegate void HubMessageHandlerDelegate(Guid msgId, DateTime timestamp, string channel, object data);
}