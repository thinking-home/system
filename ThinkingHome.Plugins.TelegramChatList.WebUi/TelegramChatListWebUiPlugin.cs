using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebUi;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.TelegramChatList.WebUi;

public class TelegramChatListWebUiPlugin : PluginBase {
    [ConfigureWebUi]
    public void RegisterWebUiPages(WebUiConfigurationBuilder config)
    {
        config.RegisterPage("/telegram-chat-list", "ThinkingHome.Plugins.TelegramChatList.WebUi.Resources.app.telegramChatList.js");
    }
}
