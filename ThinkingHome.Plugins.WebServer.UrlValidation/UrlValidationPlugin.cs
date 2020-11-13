using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer.UrlValidation
{
    public class UrlValidationPlugin : PluginBase
    {
        private static Regex caseTransformer = new Regex("([a-z])([A-Z]+)", RegexOptions.Compiled);
        private readonly List<string> errors = new List<string>();


        public override void InitPlugin()
        {
            foreach (var plugin in Context.GetAllPlugins()) {
                ValidateStaticResources(plugin);
                ValidateDynamicResources(plugin);
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

        private void ValidateDynamicResources(PluginBase plugin)
        {
            var type = plugin.GetType().GetTypeInfo();
            var alias = GetPluginAlias(type);

            foreach (var mi in plugin.FindMethods<HttpDynamicResourceAttribute, HttpHandlerDelegate>()) {
                var resource = mi.Meta;

                var ext = Path.GetExtension(resource.Url);
                var prefixApi = $"/api/{alias}/";
                var dynamicApi = $"/dynamic/{alias}/";

                if (resource.Url.StartsWith(prefixApi)) {
                    if (!string.IsNullOrEmpty(ext)) {
                        AddError(type, $"not empty api extension: {resource.Url} (must be empty)");
                    }
                }
                else if (resource.Url.StartsWith(dynamicApi)) {
                    if (string.IsNullOrEmpty(ext)) {
                        AddError(type, $"empty url extension: {resource.Url} (extension is required)");
                    }
                }
                else {
                    AddError(type, $"invalid url prefix: {resource.Url} (required: {prefixApi} or {dynamicApi})");
                }
            }
        }

        private void ValidateStaticResources(PluginBase plugin)
        {
            var type = plugin.GetType().GetTypeInfo();
            var alias = GetPluginAlias(type);
            var prefix = $"/static/{alias}/";

            foreach (var resource in type.GetCustomAttributes<HttpEmbeddedResourceAttribute>()) {
                if (resource.Url == "/" || resource.Url == "/favicon.ico") continue;

                var ext = Path.GetExtension(resource.Url);

                if (string.IsNullOrEmpty(ext)) {
                    AddError(type, $"empty url extension: {resource.Url}");
                }

                var isVendor = resource.Url.StartsWith("/vendor/");

                if (!isVendor && !resource.Url.StartsWith(prefix)) {
                    AddError(type, $"invalid url prefix: {resource.Url} (required: {prefix})");
                }
            }
        }

        [HttpDynamicResource("/dynamic/web-server/url-validation/errors.txt")]
        public HttpHandlerResult GetUrlErrors(HttpRequestParams requestParams)
        {
            var sb = new StringBuilder();

            errors.ForEach(msg => sb.AppendLine(msg));

            return HttpHandlerResult.Text(sb.ToString());
        }
    }
}
