using System;
namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    private readonly Guid Uid = Guid.NewGuid();
    public readonly Type Source;
    public readonly string ResourcePath;
    public readonly string Title;

    public WebUiPageDefinition(Type source, string title, string resourcePath)
    {
        Source = source;
        Title = title;
        ResourcePath = resourcePath;
    }

    public string JsPath => $"/static/webui/js/{Uid}.js";
}
