using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiConfigurationBuilder : BaseConfigurationBuilder<WebUiPageDefinition> {
    private readonly string LangId;
    public bool HasPages { get; private set; }

    public WebUiConfigurationBuilder(Type source, string langId, ObjectRegistry<WebUiPageDefinition> pages) : base(source, pages)
    {
        LangId = langId;
    }

    public WebUiConfigurationBuilder RegisterPage(string url, string jsEmbeddedResourcePath)
    {
        RegisterItem(url, new WebUiPageDefinition(Source, url, jsEmbeddedResourcePath, LangId));

        HasPages = true;

        return this;
    }
}
