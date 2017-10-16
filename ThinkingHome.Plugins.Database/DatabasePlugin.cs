using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Migrator.Providers.PostgreSQL;

namespace ThinkingHome.Plugins.Database
{
    public class DatabasePlugin : PluginBase
    {
        private readonly DbContextOptionsBuilder optionsBuilder = new DbContextOptionsBuilder<HomeDbContext>();

        private DbModelBuilderDelegate[] inits;
        private string cstring;

        public override void InitPlugin()
        {
            cstring = Configuration["connectionString"];

            if (string.IsNullOrEmpty(cstring)) throw new Exception("connection string is required");

            optionsBuilder.UseNpgsql(cstring);

            inits = Context.GetAllPlugins()
                .SelectMany(p => p.FindMethods<DbModelBuilderAttribute, DbModelBuilderDelegate>())
                .Select(obj => obj.Method)
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

                if (hash.Contains(asm.FullName)) continue;

                using (var migrator = new Migrator.Migrator(factory.CreateProvider(cstring, Logger), asm, Logger))
                {
                    migrator.Migrate();
                }

                hash.Add(asm.FullName);
            }
        }

        public DbContext OpenSession()
        {
            return new HomeDbContext(inits, optionsBuilder.Options);
        }
    }
}
