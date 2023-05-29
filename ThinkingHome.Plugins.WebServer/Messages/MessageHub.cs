using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ThinkingHome.Plugins.WebServer.Messages
{
    public static class MessageHubExtensions
    {
        public static Task Send(this IHubContext<MessageHub> context, string topic, object data)
        {
            return MessageHub.InternalSend(context.Clients.All, topic, data);
        }
    }

    public class MessageHub : Hub
    {
        public const string CLIENT_METHOD_NAME = "serverMessage";

        public const string SERVER_METHOD_NAME = nameof(Send);

        public const string HUB_ROUTE = "hub";

        public const int RECONNECTION_TIMEOUT_MS = 7000;

        public Task Send(string topic, object data)
        {
            return InternalSend(Clients.All, topic, data);
        }

        internal static event HubMessageHandlerDelegate Message;

        internal static Task InternalSend(IClientProxy clients, string topic, object data)
        {
            var messageId = Guid.NewGuid();
            var timestamp = DateTime.Now;

            Message?.Invoke(messageId, timestamp, topic, data);

            return clients.SendAsync(CLIENT_METHOD_NAME, new {guid = messageId, timestamp, topic, data});
        }
    }
}
