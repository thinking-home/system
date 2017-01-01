    using System;
    using Microsoft.EntityFrameworkCore;

namespace ThinkingHome.Plugins.Database
{
    public class HomeDbContext : DbContext
    {
        private readonly Action<ModelBuilder>[] inits;

        public HomeDbContext(Action<ModelBuilder>[] inits, DbContextOptions options) : base(options)
        {
            this.inits = inits;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            if (inits == null) return;

            foreach (var action in inits)
            {
                action(modelBuilder);
            }
        }
    }
}