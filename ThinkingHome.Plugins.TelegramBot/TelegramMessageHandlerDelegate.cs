using Telegram.Bot.Types;

namespace ThinkingHome.Plugins.TelegramBot
{
    public delegate void TelegramMessageHandlerDelegate(string command, Message message);
}
