using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace ThinkingHome.Core.Infrastructure
{
    public class HomeConfiguration
    {
        public readonly IConfiguration Configuration;

        public readonly LoggerConfiguration LoggerConfiguration;

        public HomeConfiguration()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", true)
                .AddEnvironmentVariables();

            Configuration = builder.Build();

            LoggerConfiguration = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration);
        }

        public IConfigurationSection GetPluginSection(Type type)
        {
            return Configuration.GetSection($"plugins:{type.FullName}");
        }

        public IEnumerable<Assembly> GetDependencies()
        {
            return Configuration.GetSection("assemblies")
                .GetChildren()
                .Select(asm =>
                {
                    var name = new AssemblyName(asm.Value);
                    return Assembly.Load(name);
                });
        }

        public CultureInfo GetCulture()
        {
            var cultureName = Configuration["culture"] ?? string.Empty;
            return CultureInfo.GetCultureInfo(cultureName);
        }
    }
}
