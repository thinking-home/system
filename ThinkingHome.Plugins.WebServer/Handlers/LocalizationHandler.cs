using System;
using System.Globalization;
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

        public LocalizationHandler(HttpLocalizationResourceAttribute resource, IStringLocalizer stringLocalizer)
            :base(resource)
        {
            if (resource == null) throw new ArgumentNullException(nameof(resource));

            this.stringLocalizer = stringLocalizer ?? throw new ArgumentNullException(nameof(stringLocalizer));
        }

        public override async Task<byte[]> GetContent(HttpContext context)
        {
            return await Task.Run(() =>
            {
                var values = stringLocalizer
                    .GetAllStrings()
                    .ToDictionary(str => str.Name, str => str.Value);

                var result = new
                {
                    culture = CultureInfo.CurrentUICulture.Name,
                    values
                };

                var json = result.ToJson();

                return Encoding.UTF8.GetBytes(json);
            });
        }
    }
}
