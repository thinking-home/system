using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Args;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramBotPlugin : PluginBase
    {
        private TelegramBotClient bot;

        public override void InitPlugin()
        {
            var token = Configuration["token"];

            bot = new TelegramBotClient(token);
            bot.OnMessage += OnMessage;

            var me = bot.GetMeAsync().Result;
            Logger.LogInformation($"Hello! My name is {me.FirstName} ({me.Username})");
        }

        public override void StartPlugin()
        {
            bot.StartReceiving();
        }

        public override void StopPlugin()
        {
            bot.StopReceiving();
        }

        private void OnMessage(object sender, MessageEventArgs msg)
        {
            Logger.LogInformation($"New telegram message: {msg.Message.Text}");
        }
    }
}