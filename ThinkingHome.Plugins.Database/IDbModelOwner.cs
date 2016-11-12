using Microsoft.EntityFrameworkCore;

namespace ThinkingHome.Plugins.Database
{
    public interface IDbModelOwner
    {
        void InitModel(ModelBuilder modelBuilder);
    }
}