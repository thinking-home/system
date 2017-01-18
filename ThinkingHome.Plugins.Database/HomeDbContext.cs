using Microsoft.EntityFrameworkCore;

namespace ThinkingHome.Plugins.Database
{
    public class HomeDbContext : DbContext
    {
        private readonly DbModelBuilderDelegate[] inits;

        public HomeDbContext(DbModelBuilderDelegate[] inits, DbContextOptions options) : base(options)
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