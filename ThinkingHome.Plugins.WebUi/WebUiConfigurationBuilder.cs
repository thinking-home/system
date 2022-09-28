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

    public void RegisterPage(string url, string jsResourcePath, string? cssResourcePath = null)
    {
        EnsureState();
        
        pages.Register(url, new WebUiPageDefinition(source, url, jsResourcePath, cssResourcePath));
    }
}
