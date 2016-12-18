using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Migrator.Providers.PostgreSQL;

namespace ThinkingHome.Plugins.Database
{    
    public class DatabasePlugin : PluginBase
    {
        private Action<ModelBuilder>[] inits;

        public override void InitPlugin()
        {
            inits = Context.GetAllPlugins<IDbModelOwner>()
                .Select(plugin => (Action<ModelBuilder>)plugin.InitModel)
                .ToArray();

            ApplyMigrations();
        }

        private void ApplyMigrations()
        {
            var factory = new PostgreSQLProviderFactory();
            var hash = new HashSet<string>();

            foreach (var plugin in Context.GetAllPlugins())
            {
                var asm = plugin.GetType().GetTypeInfo().Assembly;

                if (!hash.Contains(asm.FullName))
                {
                    using (var migrator = new Migrator.Migrator(
                        factory.CreateProvider(
                            "host=localhost;port=5432;database=postgres;user name=postgres;password=123"),
                        asm))
                    {
                        migrator.Migrate();
                    }

                    hash.Add(asm.FullName);
                }
            }
        }

        public DbContext OpenSession()
        {
            return new HomeDbContext(inits);
        }
    }
}
