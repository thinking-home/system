using System;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Telegram.Bot.Types;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Cron;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Mail;
using ThinkingHome.Plugins.Mqtt;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.TelegramBot;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Tmp
{
    [HttpLocalizationResource("/static/tmp/lang.json")]
    public class TmpPlugin : PluginBase
    {
        private readonly DatabasePlugin database;
        private readonly ScriptsPlugin scripts;
        private readonly CronPlugin cron;
        private readonly MqttPlugin mqtt;
        private readonly TelegramBotPlugin telegramBot;
        private readonly MailPlugin mail;
        private readonly WebServerPlugin server;

        public TmpPlugin(DatabasePlugin database, ScriptsPlugin scripts, CronPlugin cron,
            MqttPlugin mqtt, TelegramBotPlugin telegramBot, MailPlugin mail, WebServerPlugin server)
        {
            this.database = database;
            this.scripts = scripts;
            this.cron = cron;
            this.mqtt = mqtt;
            this.telegramBot = telegramBot;
            this.mail = mail;
            this.server = server;
        }

        public override void InitPlugin()
        {
            Logger.LogInformation("init tmp plugin {Guid}", Guid.NewGuid());
            Logger.LogInformation(StringLocalizer.GetString("hello"));

            telegramBot.SendMessage(353206782, "MOOO!!!!!");

            var sb = new StringBuilder("===================\nall strings:\n");

            foreach (var str in StringLocalizer.GetAllStrings(true)) {
                sb.AppendLine($"{str.Name}: {str.Value} ({str.SearchedLocation})");
            }

            Logger.LogInformation(sb.ToString());

            Logger.LogInformation(StringLocalizer.GetString("bye"));
        }

        public override void StartPlugin()
        {
            var result = scripts.ExecuteScript("return host.api.мукнуть('это полезно!')");

            Logger.LogInformation("script result: {Result}", result);

            Logger.LogWarning("start tmp plugin {Guid}", Guid.NewGuid());

            scripts.ExecuteScript("host.api.мукнуть('хрюката', 12)");
            mail.SendMail("dima117a@gmail.com", "Привет от коровы!", "Привет!\nЭто маленькая корова. У меня всё хорошо.");
        }

        public override void StopPlugin()
        {
            Logger.LogDebug("stop tmp plugin {Guid}", Guid.NewGuid());
        }

        [ConfigureWebUi]
        public void RegisterWebUiPages(WebUiConfigurationBuilder config)
        {
            config.RegisterPage("/page1", "ThinkingHome.Plugins.Tmp.Resources.app.page1.js");
            config.RegisterPage("/page2", "ThinkingHome.Plugins.Tmp.Resources.app.page2.js");
        }

        [ConfigureWebServer]
        public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
        {
            config
                .RegisterDynamicResource("/api/tmp/signalr-send", TmpSendSignalrMessage)
                .RegisterDynamicResource("/api/tmp/mqtt-send", TmpSendMqttMessage)
                .RegisterDynamicResource("/api/tmp/hello-pig", HelloPigHttpMethod)
                .RegisterDynamicResource("/api/tmp/wefwefwef", TmpHandlerMethod)
                .RegisterDynamicResource("/api/tmp/index42", TmpHandlerMethod42)
                .RegisterDynamicResource("/api/tmp/pigs", TmpHandlerMethodPigs);
        }

        private HttpHandlerResult HelloPigHttpMethod(HttpRequestParams requestParams)
        {
            telegramBot.SendMessage(353206782, "ДОБРЫЙ ВЕЧЕР");
            return null;
        }

        private HttpHandlerResult TmpHandlerMethod(HttpRequestParams requestParams)
        {
            scripts.EmitScriptEvent("mimi", 1, 2, 3, "GUID-111");
            return null;
        }

        private HttpHandlerResult TmpHandlerMethod42(HttpRequestParams requestParams)
        {
            return HttpHandlerResult.Json(new {
                answer = 42,
                name = requestParams.GetString("name")
            });
        }

        private HttpHandlerResult TmpHandlerMethodPigs(HttpRequestParams requestParams)
        {
            using (var db = database.OpenSession()) {
                var list = db.Set<SmallPig>()
                    .Select(pig => new { id = pig.Id, name = pig.Name, size = pig.Size })
                    .ToList();

                return HttpHandlerResult.Json(list);
            }
        }


        private HttpHandlerResult TmpSendMqttMessage(HttpRequestParams requestParams)
        {
            var topic = requestParams.GetString("topic") ?? "test";
            var msg = requestParams.GetString("msg") ?? "mumu";

            mqtt.Publish(topic, msg);

            return null;
        }

        private HttpHandlerResult TmpSendSignalrMessage(HttpRequestParams requestParams)
        {
            var topic = requestParams.GetString("topic") ?? "test";
            var msg = requestParams.GetString("msg") ?? "mumu";

            server.Send(topic, new { msg, guid = Guid.NewGuid() });

            return null;
        }


        [MqttMessageHandler]
        public void HandleMqttMessage(string topic, byte[] payload)
        {
            var str = Encoding.UTF8.GetString(payload);

            if (topic == "test") {
                Logger.LogWarning("TEST MESSAGE: {Message}", str);
            }
            else {
                Logger.LogInformation("{Topic}: {Message}", topic, str);
            }
        }

        [TimerCallback(10000)]
        public void MimimiTimer(DateTime now)
        {
            using var db = database.OpenSession();
            db.Set<SmallPig>().ToList()
                .ForEach(pig => Logger.LogWarning("{Name}, size: {Size} ({Id})", pig.Name, pig.Size, pig.Id));
        }

        // [TimerCallback(5000)]
        // public void MimimiMqTimer(DateTime now)
        // {
        //     Context.Require<WebServerPlugin>().Send("mi-mi-mi", DateTime.Now);
        // }

        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SmallPig>();
        }

        [ScriptCommand("мукнуть")]
        public int SayMoo(string text, int count)
        {
            Logger.LogInformation("count = {Count}", count);

            var msg = $"Корова сказала: Му - {text}";

            for (var i = 0; i < count; i++) {
                Logger.LogInformation("{Index} - {Message}", i + 1, msg);
            }

            return 2459 + count;
        }

        [TelegramMessageHandler("test")]
        public void ReplyToTelegramMessage(string command, Message msg)
        {
            telegramBot.SendMessage(msg.Chat.Id, $"Ваше сообщение ({msg.Text}) получено");
            telegramBot.SendMessage(msg.Chat.Id, $"Ловите новенький GUID ({Guid.NewGuid():D})");

            // telegramBot.SendFile(msg.Chat.Id, new Uri("https://www.noo.com.by/assets/files/PDF/PK314.pdf"));
            telegramBot.SendFile(msg.Chat.Id, "mimimi.txt", new MemoryStream(Encoding.UTF8.GetBytes("хри-хри")));
            telegramBot.SendPhoto(msg.Chat.Id, new Uri("http://историк.рф/wp-content/uploads/2017/03/2804.jpg"));

            mail.SendMail("dima117a@gmail.com", "Test message", "This is the test");
        }

        [TelegramMessageHandler]
        public void ReplyToTelegramMessage2(string command, Message msg)
        {
            telegramBot.SendMessage(msg.Chat.Id, $"mi mi mi");
            Logger.LogInformation("NEW TELEGRAM MESSAGE: {Message} (cmd: {Command})", msg.Text, command);
        }

        [ScriptCommand("протестировать")]
        public void VariableParamsCount(int count, params object[] strings)
        {
            var msg = string.Join("|", strings);

            for (var i = 0; i < count; i++) {
                Logger.LogCritical("{Index} - {Message}", i + 1, msg);
            }
        }

        // [WebApiMethod("/api/tmp/add-schedule")]
        // public object AddTimer(HttpRequestParams requestParams)
        // {
        //     using (var db = Context.Require<DatabasePlugin>().OpenSession())
        //     {
        //         var time = DateTime.Now.AddMinutes(1);
        //
        //         var t = new CronTask
        //         {
        //             Id = Guid.NewGuid(),
        //             Enabled = true,
        //             EventAlias = $"event:{time.ToShortTimeString()}",
        //             Name = $"time:{time.ToShortTimeString()}"
        //         };
        //
        //         db.Set<CronTask>().Add(t);
        //         db.SaveChanges();
        //     }
        //
        //     Context.Require<CronPlugin>().ReloadTasks();
        //
        //     return 200;
        // }

        // [WebApiMethod("/api/tmp/send")]
        // public object SendEmail(HttpRequestParams requestParams)
        // {
        //     Context.Require<MailPlugin>()
        //            .SendMail("dima117a@gmail.com", "test2", Guid.NewGuid().ToString());
        //
        //     return null;
        // }

        [ScriptCommand("generateBuffer")]
        public Scripts.Buffer GetTestBuffer()
        {
            var content = Guid.NewGuid().ToString();
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);

            return new Scripts.Buffer(bytes);
        }

        // [HubMessageHandler("mi-mi-mi")]
        // public void TestMessageHandler(Guid msgId, DateTime timestamp, string channel, object data)
        // {
        //     Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, channel, data);
        // }

        [CronHandler]
        public void TestCronHandler(Guid cronTaskId)
        {
            Logger.LogWarning("CRON!!!!!!!!!!!! {TaskId}", cronTaskId);
        }
    }
}
