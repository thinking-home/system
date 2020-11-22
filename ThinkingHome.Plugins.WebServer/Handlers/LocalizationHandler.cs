using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    // todo: вынести в отдельный плагин и упрятать в dynamic resource
    public class LocalizationHandler : BaseHandler
    {
        private readonly IStringLocalizer stringLocalizer;

        public LocalizationHandler(IStringLocalizer stringLocalizer) : base(true)
        {
            this.stringLocalizer = stringLocalizer ?? throw new ArgumentNullException(nameof(stringLocalizer));
        }

        public override async Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            return await Task.Run(() => {
                var values = stringLocalizer
                    .GetAllStrings()
                    .ToDictionary(str => str.Name, str => str.Value);

                var result = new {
                    culture = CultureInfo.CurrentUICulture.Name,
                    values
                };

                return HttpHandlerResult.Json(result);
            });
        }
    }
}
