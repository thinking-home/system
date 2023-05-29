using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiConfigurationBuilder: BaseConfigurationBuilder<WebUiPageDefinition>
{
    public WebUiConfigurationBuilder(Type source, ObjectRegistry<WebUiPageDefinition> pages): base(source, pages)
    {
    }

    public WebUiConfigurationBuilder RegisterPage(string url, string jsResourcePath)
    {
        RegisterItem(url, new WebUiPageDefinition(Source, url, jsResourcePath));

        return this;
    }
}
