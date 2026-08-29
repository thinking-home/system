using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scripts.WebUi
{
    public class ScriptsWebUiPlugin : PluginBase
    {
        // Клиентскую часть собирает th-build: рядом с каждым бандлом он кладет
        // предсжатые копии, поэтому пути к ним указываются вместе с исходным файлом.
        private const string APP = "ThinkingHome.Plugins.Scripts.WebUi.Resources.app.";

        private const string FONTS = "ThinkingHome.Plugins.Scripts.WebUi.Resources.fonts.";
        private const string FONTS_URL = "/vendor/fonts/";
        private const string MIME_WOFF2 = "font/woff2";

        private static readonly string[] fonts = [
            "jetbrains-mono-latin.woff2",
            "jetbrains-mono-cyrillic.woff2"
        ];

        private static StaticResource Bundle(string name) =>
            new($"{APP}{name}", $"{APP}{name}.gz", $"{APP}{name}.br");

        [ConfigureWebUi]
        public void RegisterWebUiPages(WebUiConfigurationBuilder config)
        {
            config.RegisterPage("/scripts", Bundle("list.js"));
            config.RegisterPage("/scripts/edit", Bundle("editor.js"));
        }

        [ConfigureWebServer]
        public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
        {
            // Шрифт редактора хранится в ресурсах плагина: система работает в локальной
            // сети, поэтому грузить его из интернета нельзя. Файлы woff2 уже сжаты.
            foreach (var font in fonts) {
                config.RegisterEmbeddedResource(FONTS_URL + font, FONTS + font, MIME_WOFF2);
            }
        }
    }
}
