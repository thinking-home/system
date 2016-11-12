using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;

namespace ThinkingHome.Plugins.Database
{    
    public class DatabasePlugin : PluginBase
    {
        private Action<ModelBuilder>[] inits;

        public override void InitPlugin()
        {
            inits = Context.GetAllPlugins()
                .Select(GetInitializer)
                .Where(init => init != null)
                .ToArray();
        }

        private Action<ModelBuilder> GetInitializer(PluginBase plugin)
        {
            if (!(plugin is IDbModelOwner)) return null;

            return ((IDbModelOwner) plugin).InitModel;
        }

        public DbContext OpenSession()
        {
            return new HomeDbContext(inits);
        }
    }
}
