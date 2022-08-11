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
using Telegram.Bot.Types.InputFiles;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.TelegramBot
{
    public class TelegramBotPlugin : PluginBase, IUpdateHandler
    {
        private static readonly Regex CommandRegex = new Regex("^\\s*/([a-zа-яё0-9-_]+)", RegexOptions.IgnoreCase | RegexOptions.Compiled);

        private ObjectSetRegistry<TelegramMessageHandlerDelegate> handlers;

        private TelegramBotClient bot;
        
        private readonly CancellationTokenSource cts = new CancellationTokenSource();
        
        private readonly ReceiverOptions receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = new[] { UpdateType.Message }
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
            bot.GetMeAsync().ContinueWith(me =>
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

                SafeInvokeAsync(handlers[command], fn => fn(command, msg));

                SafeInvokeAsync(handlers[TelegramMessageHandlerAttribute.ALL_COMMANDS], fn => fn(command, msg));
          
            }

            return Task.CompletedTask;
        }

        public Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
        {
            Logger.LogError(exception, "telegram bot API request error");
            
            return Task.CompletedTask;
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
            Try(t => t.SendTextMessageAsync(chatId, text, cancellationToken: cts.Token));
        }

        public void SendPhoto(long chatId, string filename, Stream content)
        {
            var file = new InputOnlineFile(content, filename);

            Try(t => t.SendPhotoAsync(chatId, file, cancellationToken: cts.Token));
        }

        public void SendPhoto(long chatId, Uri url)
        {
            var file = new InputOnlineFile(url);

            Try(t => t.SendPhotoAsync(chatId, file, cancellationToken: cts.Token));
        }

        public void SendFile(long chatId, string filename, Stream content)
        {
            var file = new InputOnlineFile(content, filename);

            Try(t => t.SendDocumentAsync(chatId, file, cancellationToken: cts.Token));
        }

        public void SendFile(long chatId, Uri url)
        {
            var file = new InputOnlineFile(url);

            Try(t => t.SendDocumentAsync(chatId, file, cancellationToken: cts.Token));
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
