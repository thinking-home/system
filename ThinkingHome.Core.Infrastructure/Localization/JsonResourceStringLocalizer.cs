using System;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using System.Threading;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;

namespace ThinkingHome.Core.Infrastructure.Localization
{
    public class JsonResourceStringLocalizer : IStringLocalizer
    {
        private readonly CultureInfo culture;
        private readonly Assembly assembly;
        private readonly string baseName;
        private readonly ILogger logger;

        public JsonResourceStringLocalizer(Assembly assembly, string baseName, ILogger logger)
        {
            this.assembly = assembly ?? throw new ArgumentNullException(nameof(assembly));
            this.baseName = baseName ?? throw new ArgumentNullException(nameof(baseName));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public JsonResourceStringLocalizer(CultureInfo culture, Assembly assembly, string baseName, ILogger logger)
            :this(assembly, baseName, logger)
        {
            this.culture = culture;
        }

        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
        {
            throw new System.NotImplementedException();
        }

        public IStringLocalizer WithCulture(CultureInfo cultureInfo)
        {
            return new JsonResourceStringLocalizer(cultureInfo, assembly, baseName, logger);
        }

        LocalizedString IStringLocalizer.this[string name]
        {
            get
            {
                var translation = GetTralslation(name);
                var str = translation ?? name;
                return new LocalizedString(name, str, translation == null);
            }
        }

        LocalizedString IStringLocalizer.this[string name, params object[] arguments]
        {
            get
            {
                var translation = GetTralslation(name);
                var str = translation ?? name;
                return new LocalizedString(name, string.Format(str, arguments), translation == null);
            }
        }

        private string GetTralslation(string name)
        {
            var culture = this.culture ?? CultureInfo.CurrentUICulture;

            return $"<<{name}:::{assembly.FullName}:::{baseName}.{culture.Name}>>";
        }
    }
}
