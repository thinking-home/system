using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiConfigurationBuilder: IDisposable
{
    private bool disposed;
    private readonly Type source;
    private readonly ObjectRegistry<WebUiPageDefinition> pages;
    
    public WebUiConfigurationBuilder(Type source, ObjectRegistry<WebUiPageDefinition> pages)
    {
        this.source = source;
        this.pages = pages;
    }

    public void Dispose()
    {
        disposed = true;
    }

    private void EnsureState()
    {
        if (disposed) {
            throw new InvalidOperationException("Can't add page into disposed registry");
        }
    }
    
    public WebUiConfigurationBuilder RegisterPage(string url, string title, string resourcePath)
    {
        EnsureState();
        
        pages.Register(url, new WebUiPageDefinition(source, title, resourcePath));
        return this;
    }
}
