using System;
using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Server.Kestrel.Internal.System.Buffers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.Mail;
using ThinkingHome.Plugins.Scheduler;
using ThinkingHome.Plugins.Scheduler.Model;
using Buffer = ThinkingHome.Plugins.Scripts.Buffer;

namespace ThinkingHome.Plugins.Tmp
{
    [AppSection(SectionType.User, "tmp user section 1", "/static/tmp/index1.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 4)]
    [AppSection(SectionType.User, "tmp user section 2", "/static/tmp/index2.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js", SortOrder = 2)]
    [AppSection(SectionType.User, "tmp user section 3", "/static/tmp/index3.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]
    [AppSection(SectionType.System, "Weather locations", "/static/tmp/inde6.js", "ThinkingHome.Plugins.Tmp.Resources.tmp.js")]

    public class TmpPlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.LogInformation($"init tmp plugin {Guid.NewGuid()}");
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

        [TimerCallback(30000)]
        public void MimimiTimer(DateTime now)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                db.Set<SmallPig>().ToList()
                    .ForEach(pig => Logger.LogWarning($"{pig.Name}, size: {pig.Size} ({pig.Id})"));
            }
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
                
                var e = new SchedulerEvent
                {
                    Hours = time.Hour,
                    Minutes = time.Minute,
                    Id = Guid.NewGuid(),
                    Enabled = true,
                    EventAlias = $"event:{time.ToShortTimeString()}",
                    Name = $"time:{time.ToShortTimeString()}"
                };

                db.Set<SchedulerEvent>().Add(e);
                db.SaveChanges();
            }
            
            Context.Require<SchedulerPlugin>().ReloadTimes();

            return 200;
        }
        
        [WebApiMethod("/api/tmp/wefwefwef")]
        public object TmpHandlerMethod(HttpRequestParams requestParams)
        {
            var bytes = Encoding.UTF8.GetBytes("test");
            Context.Require<ScriptsPlugin>().EmitScriptEvent("event-name", new Buffer(bytes));
            
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
    }
}
