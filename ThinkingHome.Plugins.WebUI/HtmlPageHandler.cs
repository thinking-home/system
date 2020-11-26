using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebUi
{
    public class HtmlPageHandler<T> : BaseHandler
    {
        private readonly Func<T> method;
        public HtmlPageHandler(Func<T> method,  bool isCached) : base(isCached)
        {
            this.method = method;
        }

        public override Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            var json = method == null ? "null" : method().ToJson("null");

            return Task.Run(() => new HttpHandlerResult {
                Content = Encoding.UTF8.GetBytes($"<html><script>window.__DATA__={json};alert(window.__DATA__.msg)</script></html>"),
                ContentType = "text/html",
            });
        }
    }

    public static class WebServerConfigBuilderExtensions
    {
        public static WebServerConfigBuilder RegisterWebPage<T>(this WebServerConfigBuilder builder, string url, Func<T> method)
        {
            builder.RegisterHandler(url, new HtmlPageHandler<T>(method, method == null));

            if (method != null) {
                builder.RegisterDynamicHandler(url + ".json", args => HttpHandlerResult.Json(method()), false);
            }

            return builder;
        }
    }
}
