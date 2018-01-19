using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
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
        private static readonly Regex CommandRegex = new Regex("^\\s*/([a-zа-яё0-9-_]+)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

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
            bot.GetMeAsync().ContinueWith(me =>
            {
                if (me.Exception != null) return;

                Logger.LogInformation($"telegram bot is inited: {me.Result.FirstName} (@{me.Result.Username})");
            });
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
            Try(t => t.SendTextMessageAsync(chatId, text));
        }

        public void SendPhoto(long chatId, string filename, Stream content)
        {
            var file = new FileToSend(filename, content);

            Try(t => t.SendPhotoAsync(chatId, file));
        }

        public void SendPhoto(long chatId, Uri url)
        {
            var file = new FileToSend(url);

            Try(t => t.SendPhotoAsync(chatId, file));
        }

        public void SendFile(long chatId, string filename, Stream content)
        {
            var file = new FileToSend(filename, content);

            Try(t => t.SendDocumentAsync(chatId, file));
        }

        public void SendFile(long chatId, Uri url)
        {
            var file = new FileToSend(url);

            Try(t => t.SendDocumentAsync(chatId, file));
        }

        private void Try(Func<TelegramBotClient, Task> fn)
        {
            var task = fn(bot);
            task.Wait();

            if (task.Exception != null)
            {
                Logger.LogError(task.Exception, "telegram bot error");
            }
        }

        #endregion
    }
}
