using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class LocalizationHandler : BaseHandler<HttpLocalizationResourceAttribute>
    {
        private readonly IStringLocalizer stringLocalizer;

        public LocalizationHandler(HttpLocalizationResourceAttribute resource, string location, IStringLocalizerFactory localizerFactory)
            :base(resource)
        {
            if (resource == null) throw new ArgumentNullException(nameof(resource));
            if (string.IsNullOrEmpty(location)) throw new ArgumentException(nameof(location));
            if (localizerFactory == null) throw new ArgumentNullException(nameof(localizerFactory));

            stringLocalizer = localizerFactory.Create(resource.BaseName, location);
        }

        public override async Task<byte[]> GetContent(HttpContext context)
        {
            return await Task.Run(() =>
            {
                var result = stringLocalizer
                    .GetAllStrings()
                    .ToDictionary(str => str.Name, str => str.Value);

                var json = result.ToJson();

                return Encoding.UTF8.GetBytes(json);
            });
        }
    }
}