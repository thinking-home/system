using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;

namespace ThinkingHome.Core.Infrastructure.Localization
{
    public static class LocalizationServiceCollectionExtensions
    {
        public static IServiceCollection AddJsonLocalization(this IServiceCollection services, Action<LocalizationOptions> setupAction)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            services.AddOptions();

            services.TryAddSingleton<IStringLocalizerFactory, JsonResourceStringLocalizerFactory>();
            services.TryAddTransient(typeof(IStringLocalizer<>), typeof(StringLocalizer<>));

            if (setupAction != null)
            {
                services.Configure(setupAction);
            }

            return services;
        }
    }
}
