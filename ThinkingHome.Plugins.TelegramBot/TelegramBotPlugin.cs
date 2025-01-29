using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramBotPlugin : PluginBase, IUpdateHandler
    {
        private static readonly Regex CommandRegex = new Regex("^\\s*/([a-zа-яё0-9-_]+)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private ObjectSetRegistry<TelegramMessageHandlerDelegate> handlers;

        private TelegramBotClient bot;
        
        private readonly CancellationTokenSource cts = new();
        
        private readonly ReceiverOptions receiverOptions = new() {
            AllowedUpdates = [UpdateType.Message]
        };

        public override void InitPlugin()
        {
            // init bot client
            var token = Configuration["token"];

            bot = new TelegramBotClient(token);

            // register handlers
            handlers = Context.GetAllPlugins()
                .FindMethods<TelegramMessageHandlerAttribute, TelegramMessageHandlerDelegate>()
                .ToObjectSetRegistry(mi => mi.Meta.Command.TrimStart('/'), mi => mi.Method);

            handlers.ForEach((command, handler) => Logger.LogInformation(
                "register telegram message handler: {Command}", command));
        }

        public override void StartPlugin()
        {
            bot.StartReceiving(this, receiverOptions, cts.Token);

            // receive bot info
            bot.GetMe().ContinueWith(me =>
            {
                if (me.Exception != null) return;

                Logger.LogInformation(
                    "telegram bot is inited: {FirstName} ({Username})",
                    me.Result.FirstName, me.Result.Username);
            });
        }

        public override void StopPlugin()
        {
            cts.Cancel();
        }

        #region receive message

        public Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
        {
            if (update.Message is { } msg) {
                var command = ParseCommand(msg.Text);

                Logger.LogInformation(
                    "New telegram message: messageID: {MessageId}; chatID: {ChatId} ({Username})",
                    msg.MessageId, msg.Chat.Id, msg.Chat.Username);

                _ = SafeInvokeAsync(handlers[command], fn => fn(command, msg));

                _ = SafeInvokeAsync(handlers[TelegramMessageHandlerAttribute.ALL_COMMANDS], fn => fn(command, msg));
          
            }

            return Task.CompletedTask;
        }

        public Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, HandleErrorSource source, CancellationToken cancellationToken)
        {
            Logger.LogError(exception, "telegram bot API request error");
            return Task.Delay(5000, cancellationToken);
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
            Try(t => t.SendMessage(chatId, text, cancellationToken: cts.Token));
        }

        public void SendPhoto(long chatId, string filename, Stream content)
        {
            var file = new InputFileStream(content, filename);

            Try(t => t.SendPhoto(chatId, file, cancellationToken: cts.Token));
        }

        public void SendPhoto(long chatId, Uri url)
        {
            var file = new InputFileUrl(url);

            Try(t => t.SendPhoto(chatId, file, cancellationToken: cts.Token));
        }

        public void SendFile(long chatId, string filename, Stream content)
        {
            var file = new InputFileStream(content, filename);

            Try(t => t.SendDocument(chatId, file, cancellationToken: cts.Token));
        }

        public void SendFile(long chatId, Uri url)
        {
            var file = new InputFileUrl(url);

            Try(t => t.SendDocument(chatId, file, cancellationToken: cts.Token));
        }

        private void Try(Func<TelegramBotClient, Task> fn)
        {
            try {
                fn(bot).Wait();
            }
            catch (Exception ex) {
                Logger.LogError(ex, "telegram bot error");
            }
        }

        #endregion
    }
}
