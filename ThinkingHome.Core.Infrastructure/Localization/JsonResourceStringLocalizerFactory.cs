using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace ThinkingHome.Core.Infrastructure.Localization
{
    public class JsonResourceStringLocalizerFactory : IStringLocalizerFactory
    {
        private readonly ILoggerFactory loggerFactory;
        private readonly ConcurrentDictionary<string, IStringLocalizer> localizerCache = new ConcurrentDictionary<string, IStringLocalizer>();
        private readonly string resourcesPath;

        public JsonResourceStringLocalizerFactory(IOptions<LocalizationOptions> options, ILoggerFactory loggerFactory)
        {
            resourcesPath = options.Value.ResourcesPath
                ?.Replace(Path.DirectorySeparatorChar, '.')
                ?.Replace(Path.AltDirectorySeparatorChar, '.');

            this.loggerFactory = loggerFactory;
        }

        public IStringLocalizer Create(Type resourceSource)
        {
            if (resourceSource == null) throw new ArgumentNullException(nameof(resourceSource));

            var typeInfo = resourceSource.GetTypeInfo();
            var assembly = typeInfo.Assembly;
            var assemblyName = new AssemblyName(assembly.FullName);

            var baseName = GetResourcePrefix(assemblyName.Name, typeInfo.Name);

            return localizerCache.GetOrAdd(baseName, _ => CreateStringLocalizer(assembly, baseName));
        }

        public IStringLocalizer Create(string baseName, string location)
        {
            if (baseName == null) throw new ArgumentNullException(nameof(baseName));
            if (location == null) throw new ArgumentNullException(nameof(location));

            return localizerCache.GetOrAdd($"B={baseName},L={location}", _ =>
            {
                var assemblyName = new AssemblyName(location);
                var assembly = Assembly.Load(assemblyName);
                baseName = GetResourcePrefix(assemblyName.Name, baseName);

                return CreateStringLocalizer(assembly, baseName);
            });
        }

        protected virtual IStringLocalizer CreateStringLocalizer(Assembly assembly, string baseName)
        {
            return new JsonResourceStringLocalizer(assembly, baseName, loggerFactory.CreateLogger<JsonResourceStringLocalizer>());
        }

        protected virtual string GetResourcePrefix(string location, string baseName)
        {
            var parts = string.IsNullOrWhiteSpace(resourcesPath)
                ? new[] {location, baseName}
                : new[] {location, resourcesPath, baseName};

            return string.Join(".", parts.Select(el => el.Trim('.')));
        }

        private static string TrimPrefix(string name, string prefix)
        {
            return name.StartsWith(prefix, StringComparison.Ordinal)
                ? name.Substring(prefix.Length)
                : name;
        }
    }
}
