﻿using System;
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

namespace ThinkingHome.Plugins.Tmp
{
    // [AppSection(SectionType.Common, "tmp user section 1", "/static/tmp/index1.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 4)]
    // [AppSection(SectionType.Common, "tmp user section 2", "/static/tmp/index2.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 2)]
    // [AppSection(SectionType.Common, "tmp user section 3", "/static/tmp/index3.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]
    // [AppSection(SectionType.System, "Weather locations", "/static/tmp/inde6.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]
    //
    // [TemplateResource("/static/tmp/tmp.tpl", "ThinkingHome.Plugins.Tmp.Resources.tmp.tpl")]
    [HttpLocalizationResource("/static/tmp/lang.json")]

    public class TmpPlugin : PluginBase
    {
        private readonly DatabasePlugin database;
        private readonly ScriptsPlugin scripts;
        private readonly CronPlugin cron;
        private readonly MqttPlugin mqtt;
        private readonly TelegramBotPlugin telegramBot;

        public TmpPlugin(DatabasePlugin database, ScriptsPlugin scripts, CronPlugin cron,
            MqttPlugin mqtt, TelegramBotPlugin telegramBot)
        {
            this.database = database;
            this.scripts = scripts;
            this.cron = cron;
            this.mqtt = mqtt;
            this.telegramBot = telegramBot;
        }

        public override void InitPlugin()
        {
            Logger.LogInformation($"init tmp plugin {Guid.NewGuid()}");
            Logger.LogInformation(StringLocalizer.GetString("hello"));

            telegramBot.SendMessage(353206782, "MOOO!!!!!");

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
            var result = scripts.ExecuteScript("return host.api.мукнуть('это полезно!')");

            Logger.LogInformation($"script result: {result}");

            Logger.LogWarning($"start tmp plugin {Guid.NewGuid()}");

            // Context.Require<ScriptsPlugin>().ExecuteScript("host.api.мукнуть('хрюката', 12)");
            // Context.Require<MailPlugin>().SendMail("dima117a@gmail.com", "Привет от коровы!", "Привет!\nЭто маленькая корова. У меня всё хорошо.");
        }

        public override void StopPlugin()
        {
            Logger.LogDebug($"stop tmp plugin {Guid.NewGuid()}");
        }

        [HttpDynamicResource("/api/tmp/mqtt-send")]
        public HttpHandlerResult TmpSendMqttMessage(HttpRequestParams requestParams)
        {
            var topic = requestParams.GetString("topic") ?? "test";
            var msg = requestParams.GetString("msg") ?? "mumu";

            mqtt.Publish(topic, msg);

            return null;
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

        [TimerCallback(10000)]
        public void MimimiTimer(DateTime now)
        {
            using (var db = database.OpenSession())
            {
                db.Set<SmallPig>().ToList()
                    .ForEach(pig => Logger.LogWarning($"{pig.Name}, size: {pig.Size} ({pig.Id})"));
            }
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
            telegramBot.SendMessage(msg.Chat.Id, $"Ваше сообщение ({msg.Text}) получено");
            telegramBot.SendMessage(msg.Chat.Id, $"Ловите новенький GUID ({Guid.NewGuid():P})");

            telegramBot.SendFile(msg.Chat.Id, new Uri("https://www.noo.com.by/assets/files/PDF/PK314.pdf"));
            telegramBot.SendFile(msg.Chat.Id, "mimimi.txt", new MemoryStream(Encoding.UTF8.GetBytes("хри-хри")));
            telegramBot.SendPhoto(msg.Chat.Id, new Uri("http://историк.рф/wp-content/uploads/2017/03/2804.jpg"));
        }

        [TelegramMessageHandler]
        public void ReplyToTelegramMessage2(string command, Message msg)
        {
            telegramBot.SendMessage(msg.Chat.Id, $"mi mi mi");
            Logger.LogInformation($"NEW TELEGRAM MESSAGE: {msg.Text} (cmd: {command})");
        }

        [ScriptCommand("протестировать")]
        public void VariableParamsCount(int count, params object[] strings)
        {
            var msg = string.Join("|", strings);

            for (var i = 0; i < count; i++)
            {
                Logger.LogCritical($"{i + 1} - {msg}");
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

        [HttpDynamicResource("/api/tmp/hello-pig")]
        public HttpHandlerResult HelloPigHttpMethod(HttpRequestParams requestParams)
        {
            telegramBot.SendMessage(353206782, "ДОБРЫЙ ВЕЧЕР");
            return null;
        }

        [HttpDynamicResource("/api/tmp/wefwefwef")]
        public HttpHandlerResult TmpHandlerMethod(HttpRequestParams requestParams)
        {
            scripts.EmitScriptEvent("mimi", 1, 2, 3, "GUID-111");
            return null;
        }

        [HttpDynamicResource("/api/tmp/index42.js")]
        public HttpHandlerResult TmpHandlerMethod42(HttpRequestParams requestParams)
        {
            return HttpHandlerResult.Json(new
            {
                answer = 42,
                name = requestParams.GetString("name")
            });
        }

        [HttpDynamicResource("/api/tmp/pigs")]
        public HttpHandlerResult TmpHandlerMethod43(HttpRequestParams requestParams)
        {
            using (var db = database.OpenSession())
            {
                var list = db.Set<SmallPig>()
                    .Select(pig => new { id = pig.Id, name = pig.Name, size = pig.Size })
                    .ToList();

                return HttpHandlerResult.Json(list);
            }
        }

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
            Logger.LogWarning("CRON!!!!!!!!!!!! {0}", cronTaskId);
        }
    }
}
