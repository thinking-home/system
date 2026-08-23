using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiConfigurationBuilder : BaseConfigurationBuilder<WebUiPageDefinition> {
    private readonly string LangId;
    public bool HasPages { get; private set; }

    public WebUiConfigurationBuilder(Type source, string langId, ObjectRegistry<WebUiPageDefinition> pages) : base(source, pages)
    {
        LangId = langId;
    }

    /// <summary>
    /// Зарегистрировать раздел веб-интерфейса. Если сборка плагина создала для бандла
    /// предсжатые копии, их пути указываются вместе с исходным (см. <see cref="StaticResource"/>).
    /// </summary>
    public WebUiConfigurationBuilder RegisterPage(string url, StaticResource js)
    {
        RegisterItem(url, new WebUiPageDefinition(Source, url, js, LangId));

        HasPages = true;

        return this;
    }
}
