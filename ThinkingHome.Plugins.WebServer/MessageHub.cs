using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ThinkingHome.Plugins.WebServer
{
    public static class MessageHubExtensions
    {
        public static Task Send(this IHubContext<MessageHub> context, string channel, object data)
        {
            return MessageHub.InternalSend(context.Clients, channel, data);
        }
    }

    public class MessageHub : Hub
    {
        public const string CLIENT_METHOD_NAME = "serverMessage";

        public const string SERVER_METHOD_NAME = nameof(Send);

        public const string HUB_ROUTE = "hub";

        public const int RECONNECTION_TIMEOUT = 7000;

        public Task Send(string channel, object data)
        {
            return InternalSend(Clients, channel, data);
        }

        internal static Task InternalSend(IHubClients clients, string channel, object data)
        {
            var guid = Guid.NewGuid();
            var timestamp = DateTime.Now;

            return clients.All.InvokeAsync(CLIENT_METHOD_NAME, new { guid, timestamp, channel, data });
        }
    }
}