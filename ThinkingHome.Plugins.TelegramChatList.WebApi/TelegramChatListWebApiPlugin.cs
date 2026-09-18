using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.TelegramChatList.Model;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.TelegramChatList.WebApi;

public class TelegramChatListWebApiPlugin(DatabasePlugin database) : PluginBase {
    [ConfigureWebServer]
    public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
    {
        config.RegisterDynamicResource("/api/telegram-chat-list/web-api/list", GetChatList);
    }

    private HttpHandlerResult GetChatList(HttpRequestParams request)
    {
        using var db = database.OpenSession();
        var list = db.Set<Chat>()
            .OrderByDescending(x => x.Date)
            .Select(x => new
            { id = x.Id, login = x.Login, chatId = x.ChatId, firstName = x.FirstName, lastName = x.LastName, date = x.Date }).ToArray();
        return HttpHandlerResult.Json(list);
    }
}
