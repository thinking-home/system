using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Scripts.Model;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase, IDbModelOwner, ITimerOwner
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
                Body = "host.logError(JSON.stringify(arguments));"
            };

//            using (var db = Context.Require<DatabasePlugin>().OpenSession())
//            {
//                db.Set<UserScript>().Add(script);
//                db.SaveChanges();
//            }

            Context.Require<ScriptsPlugin>().ExecuteScript(script);

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
    }
}