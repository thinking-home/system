using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Model;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase, IDbModelOwner, ITimerOwner, IScriptApiOwner
    {
        public override void InitPlugin()
        {
            Logger.Info($"init tmp plugin {Guid.NewGuid()}");
        }

        public override void StartPlugin()
        {
            var id = Guid.NewGuid();
            var name = id.ToString("N");
            var script = new UserScript
            {
                Id = id,
                Name = name,
                Body = "var count = arguments[0] || 7;host.мукнуть('это полезно!!!!', count); return count * 10;"
                //Body = "host.мукнуть('это полезно!', 15);host.протестировать(88, 'волк', 'коза', 'капуста1')"
                //Body = "host.logInfo(host.logError1);"
            };

            var id2 = Guid.NewGuid();
            var name2 = id2.ToString("N");
            var script2 = new UserScript
            {
                Id = id2,
                Name = name2,
                Body = $"host.logInfo(host.executeScript('{name}', 12) + 3 + '=====');"
            };

            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                db.Set<UserScript>().Add(script);
                db.Set<UserScript>().Add(script2);

                db.SaveChanges();
            }

            Context.Require<ScriptsPlugin>().ExecuteScript(script2);

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

        public void RegisterScriptMethods(RegisterScriptMethodDelegate addScriptMethod)
        {
            addScriptMethod("мукнуть", (Action<string, int>)SayMoo);
            addScriptMethod("протестировать", (Action<int, object[]>)VariableParamsCount);
        }

        public void SayMoo(string text, int count = 3)
        {
            var msg = $"Корова сказала: Му - {text}";

            for (var i = 0; i < count; i++)
            {
                Logger.Info($"{i + 1} - {msg}");
            }
        }

        public void VariableParamsCount(int count, params object[] strings)
        {
            var msg = strings.Join("|");

            for (var i = 0; i < count; i++)
            {
                Logger.Fatal($"{i + 1} - {msg}");
            }
        }
    }
}