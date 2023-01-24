using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer.UrlValidation
{
    public class UrlValidationPlugin : PluginBase
    {
        private readonly WebServerPlugin server;
        private readonly Regex caseTransformer = new("([a-z])([A-Z]+)", RegexOptions.Compiled);
        private readonly List<string> errors = new();

        public UrlValidationPlugin(WebServerPlugin server)
        {
            this.server = server;
        }

        public override void InitPlugin()
        {
            foreach (var (key, value) in server.GetAllHandlers()) {
                switch (value) {
                    case DynamicResourceHandler handler:
                        ValidateDynamicResource(key, handler);
                        break;
                    case StaticResourceHandler handler:
                        ValidateStaticResource(key, handler);
                        break;
                }
            }
        }

        private void AddError(TypeInfo pluginType, string message)
        {
            errors.Add($"[{pluginType}] :: {message}");
        }

        private string GetPluginAlias(TypeInfo pluginType)
        {
            const string PREFIX = "ThinkingHome.Plugins.";

            var name = pluginType.Assembly.GetName().Name;

            if (name.StartsWith(PREFIX)) {
                name = name.Substring(PREFIX.Length);
            }

            return caseTransformer.Replace(name, "$1-$2").Replace(".", "/").ToLower();
        }

        private void ValidateDynamicResource(string url, DynamicResourceHandler handler)
        {
            var type = handler.Source.GetTypeInfo();
            var alias = GetPluginAlias(type);

            var ext = Path.GetExtension(url);
            var prefixApi = $"/api/{alias}/";
            var dynamicApi = $"/dynamic/{alias}/";
        
            if (url.StartsWith(prefixApi)) {
                if (!string.IsNullOrEmpty(ext)) {
                    AddError(type, $"not empty api extension: {url} (must be empty)");
                }
            }
            else if (url.StartsWith(dynamicApi)) {
                if (string.IsNullOrEmpty(ext)) {
                    AddError(type, $"empty url extension: {url} (extension is required)");
                }
            }
            else {
                AddError(type, $"invalid url prefix: {url} (required: {prefixApi} or {dynamicApi})");
            }
        }
        
        private void ValidateStaticResource(string url, StaticResourceHandler handler)
        {
            var type = handler.Source.GetTypeInfo();
            var alias = GetPluginAlias(type);
            
            var prefix = $"/static/{alias}/";

            if (url is "/" or "/favicon.ico") return;
            
            var ext = Path.GetExtension(url);
            
            if (string.IsNullOrEmpty(ext)) {
                AddError(type, $"empty url extension: {url}");
            }
        
            var isVendor = url.StartsWith("/vendor/");
        
            if (!isVendor && !url.StartsWith(prefix)) {
                AddError(type, $"invalid url prefix: {url} (required: {prefix})");
            }
        }

        [ConfigureWebServer]
        public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
        {
            config.RegisterDynamicResource("/dynamic/web-server/url-validation/errors.txt", GetUrlErrors);
        }

        private HttpHandlerResult GetUrlErrors(HttpRequestParams requestParams)
        {
            var sb = new StringBuilder();
        
            errors.ForEach(msg => sb.AppendLine(msg));
        
            return HttpHandlerResult.Text(sb.ToString());
        }
    }
}
