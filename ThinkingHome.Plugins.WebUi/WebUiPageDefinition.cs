using System;
namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    private readonly Guid Uid = Guid.NewGuid();
    public readonly Type Source;
    public readonly string ResourcePath;

    public WebUiPageDefinition(Type source, string resourcePath)
    {
        
        Source = source;
        ResourcePath = resourcePath;
    }

    public string JsPath => $"/static/webui/js/{Uid}.js";
}
