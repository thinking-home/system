using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database.Tmp;

namespace ThinkingHome.Plugins.Database
{    
    public class DatabasePlugin : PluginBase
    {
        public override void InitPlugin()
        {
            Logger.Info("init Database");
            using (var db = new HomeDbContext())
            {
                db.Set<SmallPig>().ToList().ForEach(pig => Logger.Info(pig.Name));
            }
        }
    }
}
