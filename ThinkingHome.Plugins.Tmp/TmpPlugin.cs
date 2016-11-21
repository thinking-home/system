using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Timer;

namespace ThinkingHome.Plugins.Tmp
{
    public class TmpPlugin : PluginBase, IDbModelOwner
    {
        public override void InitPlugin()
        {
            Logger.Info("init tmp plugin {0}", Guid.NewGuid());

            Context.Require<TimerPlugin>().OnEvent += MimimiTimer;
        }

        public override void StartPlugin()
        {
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
    }
}