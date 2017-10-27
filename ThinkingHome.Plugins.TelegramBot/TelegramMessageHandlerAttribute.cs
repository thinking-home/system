using System;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramMessageHandlerAttribute : Attribute
    {
        public const string ALL_COMMANDS = "F8AA75301025444B90147CD0FAE48312";

        public TelegramMessageHandlerAttribute(): this(ALL_COMMANDS)
        {
        }

        public TelegramMessageHandlerAttribute(string command)
        {
            Command = command;
        }

        public string Command { get; }
    }
}
