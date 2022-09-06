namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    public readonly Type Source;
    public readonly string ResourcePath;

    public WebUiPageDefinition(Type source, string resourcePath)
    {
        Source = source;
        ResourcePath = resourcePath;
    }
}
