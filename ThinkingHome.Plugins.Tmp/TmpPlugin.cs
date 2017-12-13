using System;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Telegram.Bot.Types;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Cron;
using ThinkingHome.Plugins.Cron.Model;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.Mail;
using ThinkingHome.Plugins.Mqtt;
using ThinkingHome.Plugins.TelegramBot;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Messages;

namespace ThinkingHome.Plugins.Tmp
{
    [AppSection(SectionType.User, "tmp user section 1", "/static/tmp/index1.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 4)]
    [AppSection(SectionType.User, "tmp user section 2", "/static/tmp/index2.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 2)]
    [AppSection(SectionType.User, "tmp user section 3", "/static/tmp/index3.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]
    [AppSection(SectionType.System, "Weather locations", "/static/tmp/inde6.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]


    [HttpLocalizationResource("/static/tmp/lang.json")]

    public class TmpPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogInformation($"init tmp plugin {Guid.NewGuid()}");
            Logger.LogInformation(StringLocalizer.GetString("hello"));

            var sb = new StringBuilder("===================\nall strings:\n");

            foreach (var str in StringLocalizer.GetAllStrings(true))
            {
                sb.AppendLine($"{str.Name}: {str.Value} ({str.SearchedLocation})");
            }

            Logger.LogInformation(sb.ToString());

            Logger.LogInformation(StringLocalizer.GetString("bye"));
        }

        public override void StartPlugin()
        {
            var result = Context.Require<ScriptsPlugin>().ExecuteScript("return host.api.мукнуть('это полезно!')");

            Logger.LogInformation($"script result: {result}");

            Logger.LogWarning($"start tmp plugin {Guid.NewGuid()}");
        }

        public override void StopPlugin()
        {
            Logger.LogDebug($"stop tmp plugin {Guid.NewGuid()}");
        }


        [MqttMessageHandler]
        public void HandleMqttMessage(string topic, byte[] payload)
        {
            var str = Encoding.UTF8.GetString(payload);

            if (topic == "test")
            {
                Logger.LogWarning($"TEST MESSAGE: {str}");
            }
            else
            {
                Logger.LogInformation($"{topic}: {str}");
            }
        }

        [TimerCallback(30000)]
        public void MimimiTimer(DateTime now)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                db.Set<SmallPig>().ToList()
                    .ForEach(pig => Logger.LogWarning($"{pig.Name}, size: {pig.Size} ({pig.Id})"));
            }
        }

        [TimerCallback(5000)]
        public void MimimiMqTimer(DateTime now)
        {
            Context.Require<WebServerPlugin>().Send("mi-mi-mi", DateTime.Now);
        }

        [DbModelBuilder]
        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SmallPig>();
        }

        [ScriptCommand("мукнуть")]
        public int SayMoo(string text, int count)
        {
            Logger.LogInformation("count = {0}", count);

            var msg = $"Корова сказала: Му - {text}";

            for (var i = 0; i < count; i++)
            {
                Logger.LogInformation($"{i + 1} - {msg}");
            }

            return 2459 + count;
        }

        [TelegramMessageHandler("test")]
        public void ReplyToTelegramMessage(string command, Message msg)
        {
            var botPlugin = Context.Require<TelegramBotPlugin>();
            botPlugin.SendMessage(msg.Chat.Id, $"Ваше сообщение ({msg.Text}) получено");
            botPlugin.SendMessage(msg.Chat.Id, $"Ловите новенький GUID ({Guid.NewGuid():P})");

            botPlugin.SendFile(msg.Chat.Id, new Uri("https://www.noo.com.by/assets/files/PDF/PK314.pdf"));
            botPlugin.SendFile(msg.Chat.Id, "mimimi.txt", new MemoryStream(Encoding.UTF8.GetBytes("хри-хри")));
            botPlugin.SendPhoto(msg.Chat.Id, new Uri("http://историк.рф/wp-content/uploads/2017/03/2804.jpg"));
        }

        [TelegramMessageHandler]
        public void ReplyToTelegramMessage2(string command, Message msg)
        {
            var botPlugin = Context.Require<TelegramBotPlugin>();
            botPlugin.SendMessage(msg.Chat.Id, $"mi mi mi");
            Logger.LogInformation($"NEW TELEGRAM MESSAGE: {msg.Text} (cmd: {command})");
        }

        [ScriptCommand("протестировать")]
        public void VariableParamsCount(int count, params object[] strings)
        {
            var msg = strings.Join("|");

            for (var i = 0; i < count; i++)
            {
                Logger.LogCritical($"{i + 1} - {msg}");
            }
        }

        [WebApiMethod("/api/tmp/add-schedule")]
        public object AddTimer(HttpRequestParams requestParams)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                var time = DateTime.Now.AddMinutes(1);

                var t = new CronTask
                {
                    Id = Guid.NewGuid(),
                    Enabled = true,
                    EventAlias = $"event:{time.ToShortTimeString()}",
                    Name = $"time:{time.ToShortTimeString()}"
                };

                db.Set<CronTask>().Add(t);
                db.SaveChanges();
            }

            Context.Require<CronPlugin>().ReloadTasks();

            return 200;
        }

        [WebApiMethod("/api/tmp/wefwefwef")]
        public object TmpHandlerMethod(HttpRequestParams requestParams)
        {
            Context.Require<ScriptsPlugin>().EmitScriptEvent("mimi", 1, 2, 3, "GUID-111");
            return null;
        }

        [WebApiMethod("/api/tmp/index42")]
        public object TmpHandlerMethod42(HttpRequestParams requestParams)
        {
            return new { answer = 42, name = requestParams.GetString("name") };
        }

        [WebApiMethod("/api/tmp/pigs")]
        public object TmpHandlerMethod43(HttpRequestParams requestParams)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                return db.Set<SmallPig>()
                    .Select(pig => new { id = pig.Id, name = pig.Name, size = pig.Size })
                    .ToList();
            }
        }

        [WebApiMethod("/api/tmp/send")]
        public object SendEmail(HttpRequestParams requestParams)
        {
            Context.Require<MailPlugin>()
                   .SendMail("dima117a@gmail.com", "test2", Guid.NewGuid().ToString());

            return null;
        }

        [ScriptCommand("generateBuffer")]
        public Scripts.Buffer GetTestBuffer()
        {
            var content = Guid.NewGuid().ToString();
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);

            return new Scripts.Buffer(bytes);
        }

        [HubMessageHandler("mi-mi-mi")]
        public void TestMessageHandler(Guid msgId, DateTime timestamp, string channel, object data)
        {
            Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, channel, data);
        }
    }
}
