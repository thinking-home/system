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
            Logger.Info("init tmp plugin {0}", Guid.NewGuid());
        }

        public override void StartPlugin()
        {
            var id = Guid.NewGuid();
            var name = id.ToString("N");

            var script = new UserScript
            {
                Id = id,
                Name = name,
//                Body = "host.logInfo('mi mi mi');" +
//                       "host.logError('error!');" +
//                       "host.logError(JSON.stringify(arguments));"
                Body = "host.logInfo('outer script::::');" +
                       "host.executeScript('1f716e2656da4c8693a01b06534a0074', 12412, 'хрюката', { id: 5 });"
            };

//            using (var db = Context.Require<DatabasePlugin>().OpenSession())
//            {
//                db.Set<UserScript>().Add(script);
//                db.SaveChanges();
//            }

            Context.Require<ScriptsPlugin>().ExecuteScript(script);
            //Context.Require<ScriptsPlugin>().ExecuteScriptByName(name, new object[]{1, 2 , "муму"});

            Logger.Warn("start tmp plugin {0}", Guid.NewGuid());
        }

        public override void StopPlugin()
        {
            Logger.Debug("stop tmp plugin {0}", Guid.NewGuid());
        }

        public void MimimiTimer(DateTime now)
        {
            using (var db = Context.Require<DatabasePlugin>().OpenSession())
            {
                db.Set<SmallPig>().ToList()
                    .ForEach(pig => Logger.Warn($"{pig.Name}, size: {pig.Size} ({pig.Id})"));

            }

            //Context.Require<ScriptsPlugin>().Run();
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