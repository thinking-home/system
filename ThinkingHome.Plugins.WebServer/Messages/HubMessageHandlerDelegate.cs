using System;

namespace ThinkingHome.Plugins.WebServer.Messages
{
    public delegate void HubMessageHandlerDelegate(Guid msgId, DateTime timestamp, string topic, object data);
}
