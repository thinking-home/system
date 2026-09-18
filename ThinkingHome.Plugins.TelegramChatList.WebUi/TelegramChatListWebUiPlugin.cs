using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Handlers;
using ThinkingHome.Plugins.WebUi;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.TelegramChatList.WebUi
{
    public class TelegramChatListWebUiPlugin : PluginBase
    {
        // Клиентскую часть собирает th-build: рядом с каждым бандлом он кладет
        // предсжатые копии, поэтому пути к ним указываются вместе с исходным файлом.
        private const string APP = "ThinkingHome.Plugins.TelegramChatList.WebUi.Resources.app.";

        private static StaticResource Bundle(string name) =>
            new($"{APP}{name}", $"{APP}{name}.gz", $"{APP}{name}.br");

        [ConfigureWebUi]
        public void RegisterWebUiPages(WebUiConfigurationBuilder config)
        {
            config.RegisterPage("/telegram-chat-list", Bundle("chats.js"));
        }
    }
}
