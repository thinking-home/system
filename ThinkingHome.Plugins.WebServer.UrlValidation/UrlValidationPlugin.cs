using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Attributes.Base;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebServer.UrlValidation
{
    public class UrlValidationPlugin : PluginBase
    {
        private static Regex caseTransformer = new Regex("([a-z])([A-Z]+)", RegexOptions.Compiled);
        private readonly List<string> errors = new List<string>();


        public override void InitPlugin()
        {
            foreach (var plugin in Context.GetAllPlugins())
            {
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

            if (name.StartsWith(PREFIX))
            {
                name = name.Substring(PREFIX.Length);
            }

            return caseTransformer.Replace(name, "$1-$2").Replace(".", "/").ToLower();
        }

        private void ValidateDynamicResources(PluginBase plugin)
        {
            var type = plugin.GetType().GetTypeInfo();
            var alias = GetPluginAlias(type);

            foreach (var mi in plugin.FindMethodsByAttribute<HttpDynamicResourceAttribute, HttpHandlerDelegate>())
            {
                var resource = mi.MetaData;

                var ext = Path.GetExtension(resource.Url);

                if (resource is WebApiMethodAttribute)
                {
                    // api
                    if (!string.IsNullOrEmpty(ext))
                    {
                        AddError(type, $"not empty api extension: {resource.Url} (must be empty)");
                    }

                    var prefix = $"/api/{alias}/";

                    if (!resource.Url.StartsWith(prefix))
                    {
                        AddError(type, $"invalid url prefix: {resource.Url} (required: {prefix})");
                    }
                }
                else
                {
                    if (string.IsNullOrEmpty(ext))
                    {
                        AddError(type, $"empty url extension: {resource.Url}");
                    }

                    var prefix = $"/dynamic/{alias}/";

                    if (!resource.Url.StartsWith(prefix))
                    {
                        AddError(type, $"invalid url prefix: {resource.Url} (required: {prefix})");
                    }
                }
            }
        }

        private void ValidateStaticResources(PluginBase plugin)
        {
            var type = plugin.GetType().GetTypeInfo();
            var alias = GetPluginAlias(type);
            var prefix = $"/static/{alias}/";

            foreach (var resource in type.GetCustomAttributes<HttpStaticResourceAttribute>())
            {
                if (resource.Url == "/" || resource.Url == "/favicon.ico") continue;

                var ext = Path.GetExtension(resource.Url);

                if (string.IsNullOrEmpty(ext))
                {
                    AddError(type, $"empty url extension: {resource.Url}");
                }

                var isVendor = resource.Url.StartsWith("/vendor/");

                if (!isVendor && !resource.Url.StartsWith(prefix))
                {
                    AddError(type, $"invalid url prefix: {resource.Url} (required: {prefix})");
                }
            }
        }

        [HttpTextDynamicResource("/dynamic/web-server/url-validation/errors.txt")]
        public object GetUrlErrors(HttpRequestParams requestParams)
        {
            var sb = new StringBuilder();

            errors.ForEach(msg => sb.AppendLine(msg));

            return sb;
        }
    }
}