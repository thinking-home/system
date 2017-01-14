using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Configuration;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Attributes;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers.Api;

namespace ThinkingHome.Plugins.Tmp
{
    [HttpEmbeddedResource("/mimimi.txt", "ThinkingHome.Plugins.Tmp.mimimi.txt")]
    public class TmpPlugin : PluginBase, IDbModelOwner, ITimerOwner
    {
        public override void InitPlugin(IConfigurationSection config)
        {
            Logger.Info($"init tmp plugin {Guid.NewGuid()}");
        }

        public override void StartPlugin()
        {
//            var id = Guid.NewGuid();
//            var name = id.ToString("N");
//            var script = new UserScript
//            {
//                Id = id,
//                Name = name,
//                Body = "var count = arguments[0] || 7;host.мукнуть('это полезно!!!!', count); return count * 10;"
//                //Body = "host.мукнуть('это полезно!', 15);host.протестировать(88, 'волк', 'коза', 'капуста1')"
//                //Body = "host.logInfo(host.logError1);"
//            };

//            using (var db = Context.Require<DatabasePlugin>().OpenSession())
//            {
//                db.Set<UserScript>().Add(script);
//                db.SaveChanges();
//            }

//            Context.Require<ScriptsPlugin>()
//                .ExecuteScript(@"
//host.log.trace('mimi: {0}', 1111);
//host.log.debug('mimi: {0}', 2222);
//host.log.info('mimi: {0}', 3333);
//host.log.warn('mimi: {0}', 4444);
//host.log.error('mimi: {0}', 5555);
//host.log.fatal('mimi: {0}', 6666);
//host.log.fatal(host.log.fatal);
//host.log.fatal(host.log.fatal2);
//");

            var result = Context.Require<ScriptsPlugin>().ExecuteScript("return host.api.мукнуть('это полезно!')");

            Logger.Info($"script result: {result}");

            Logger.Warn($"start tmp plugin {Guid.NewGuid()}");
        }

        public override void StopPlugin()
        {
            Logger.Debug($"stop tmp plugin {Guid.NewGuid()}");
        }

        public void MimimiTimer(DateTime now)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                db.Set<SmallPig>().ToList()
                    .ForEach(pig => Logger.Warn($"{pig.Name}, size: {pig.Size} ({pig.Id})"));

            }
        }

        public void InitModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SmallPig>();
        }

        public void RegisterTimers(RegisterTimerDelegate addTimer)
        {
            addTimer(MimimiTimer, 7000);
        }

        [ScriptCommand("мукнуть")]
        public int SayMoo(string text, int count)
        {
            Logger.Info("count = {0}", count);

            var msg = $"Корова сказала: Му - {text}";

            for (var i = 0; i < count; i++)
            {
                Logger.Info($"{i + 1} - {msg}");
            }

            return 2459 + count;
        }

        [ScriptCommand("протестировать")]
        public void VariableParamsCount(int count, params object[] strings)
        {
            var msg = strings.Join("|");

            for (var i = 0; i < count; i++)
            {
                Logger.Fatal($"{i + 1} - {msg}");
            }
        }

        [HttpCommand("/")]
        public object TmpHandlerMethod(HttpRequestParams requestParams)
        {
            return null;
        }

        [HttpCommand("/index42")]
        public object TmpHandlerMethod42(HttpRequestParams requestParams)
        {
            return new { answer = 42, name = requestParams.GetString("name") };
        }

        [HttpCommand("/pigs")]
        public object TmpHandlerMethod43(HttpRequestParams requestParams)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                return db.Set<SmallPig>()
                    .Select(pig => new { id = pig.Id, name = pig.Name, size = pig.Size})
                    .ToList();
            }
        }
    }
}
