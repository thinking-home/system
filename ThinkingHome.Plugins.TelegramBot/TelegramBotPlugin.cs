using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Args;
using Telegram.Bot.Types;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramBotPlugin : PluginBase
    {
        private static readonly Regex CommandRegex = new Regex("^\\s*/([a-z0-9-_]+)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private ObjectSetRegistry<TelegramMessageHandlerDelegate> handlers;

        private TelegramBotClient bot;

        public override void InitPlugin()
        {
            // init bot client
            var token = Configuration["token"];

            bot = new TelegramBotClient(token);
            bot.OnMessage += OnMessage;
            bot.OnReceiveError += OnReceiveError;

            // register handlers
            handlers = Context.GetAllPlugins()
                .FindMethods<TelegramMessageHandlerAttribute, TelegramMessageHandlerDelegate>()
                .ToObjectSetRegistry(mi => mi.Meta.Command.TrimStart('/'), mi => mi.Method);

            handlers.ForEach((command, handler) => Logger.LogInformation($"register telegram message handler: \"{command}\""));
        }

        private void OnReceiveError(object sender, ReceiveErrorEventArgs e)
        {
            Logger.LogError(e.ApiRequestException, "telegram bot API request error");
        }

        public override void StartPlugin()
        {
            bot.StartReceiving();

            // receive bot info
            var me = bot.GetMeAsync();

            if (me.IsCompleted)
            {
                Logger.LogInformation($"telegram bot is inited: {me.Result.FirstName} (@{me.Result.Username})");
            }
        }

        public override void StopPlugin()
        {
            bot.StopReceiving();
        }

        #region receive message

        private void OnMessage(object sender, MessageEventArgs e)
        {
            var msg = e.Message;
            var command = ParseCommand(msg.Text);

            Logger.LogInformation($"New telegram message: messageID: {msg.MessageId}; chatID: {msg.Chat.Id}");

            SafeInvoke(handlers[command], fn => fn(command, msg), true);

            SafeInvoke(handlers[TelegramMessageHandlerAttribute.ALL_COMMANDS], fn => fn(command, msg), true);
        }

        public static string ParseCommand(string message)
        {
            var match = CommandRegex.Match(message ?? string.Empty);

            return match.Success ? match.Groups[1].Value : string.Empty;
        }

        #endregion

        #region send message

        public void SendMessage(long chatId, string text)
        {
            SendMessageInternal(chatId, text);
        }

        public void SendMessage(string channel, string text)
        {
            channel = "@" + channel?.TrimStart('@');
            SendMessageInternal(channel, text);
        }

        private void SendMessageInternal(ChatId chatId, string text)
        {
            var err = bot.SendTextMessageAsync(chatId, text).Exception;

            if (err != null)
            {
                Logger.LogError(err, "telegram bot error");
            }
        }

        #endregion
    }
}
