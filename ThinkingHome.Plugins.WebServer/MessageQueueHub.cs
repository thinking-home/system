using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace ThinkingHome.Plugins.WebServer
{
    public static class Exts
    {
        public static Task Send(this IHubContext<MessageQueueHub> context, string channel, object data)
        {
            return MessageQueueHub.InternalSend(context.Clients, channel, data);
        }
    }

    public class MessageQueueHub : Hub
    {
        public Task Send(string channel, object data)
        {
            return InternalSend(Clients, channel, data);
        }

        internal static Task InternalSend(IHubClients clients, string channel, object data)
        {
            var guid = Guid.NewGuid();
            var timestamp = DateTime.Now;

            return clients.All.InvokeAsync("serverMessage", new { guid, timestamp, channel, data });
        }
    }
}