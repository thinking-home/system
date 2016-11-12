    using Microsoft.EntityFrameworkCore;
using ThinkingHome.Plugins.Database.Tmp;

namespace ThinkingHome.Plugins.Database
{
    public class HomeDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("host=localhost;port=5432;database=postgres;user name=postgres;password=123");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SmallPig>(m => m.HasKey("Id"));
        }
    }
}