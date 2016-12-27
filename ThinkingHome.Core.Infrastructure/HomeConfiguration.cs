using System;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace ThinkingHome.Core.Infrastructure
{
    public class HomeConfiguration
    {
        public readonly IConfiguration Configuration;

        public HomeConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("project.json", true)
                .AddJsonFile("appsettings.json", true);

            Configuration = builder.Build();
        }

        public IConfigurationSection GetPluginSection(Type type)
        {
            return Configuration.GetSection($"plugins:{type.FullName}");
        }
    }
}
