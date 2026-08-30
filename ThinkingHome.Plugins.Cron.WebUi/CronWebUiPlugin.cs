using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Cron.WebUi
{
    public class CronWebUiPlugin : PluginBase
    {
        // Клиентскую часть собирает th-build: рядом с каждым бандлом он кладет
        // предсжатые копии, поэтому пути к ним указываются вместе с исходным файлом.
        private const string APP = "ThinkingHome.Plugins.Cron.WebUi.Resources.app.";

        private static StaticResource Bundle(string name) =>
            new($"{APP}{name}", $"{APP}{name}.gz", $"{APP}{name}.br");

        [ConfigureWebUi]
        public void RegisterWebUiPages(WebUiConfigurationBuilder config)
        {
            config.RegisterPage("/cron", Bundle("tasks.js"));
        }
    }
}
