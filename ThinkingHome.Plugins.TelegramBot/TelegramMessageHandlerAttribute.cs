using System;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramMessageHandlerAttribute : Attribute
    {
        public TelegramMessageHandlerAttribute(string command)
        {
            Command = command;
        }

        public string Command { get; }
    }
}
