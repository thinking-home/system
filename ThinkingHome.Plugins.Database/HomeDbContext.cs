    using System;
    using Microsoft.EntityFrameworkCore;

namespace ThinkingHome.Plugins.Database
{
    public class HomeDbContext : DbContext
    {
        private readonly Action<ModelBuilder>[] inits;

        public HomeDbContext(Action<ModelBuilder>[] inits)
        {
            this.inits = inits;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("host=localhost;port=5432;database=postgres;user name=postgres;password=123");
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