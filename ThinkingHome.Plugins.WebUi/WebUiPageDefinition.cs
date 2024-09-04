using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    public readonly string PathDocument;
    public readonly string PathJavaScript;

    public readonly Type Source;
    public readonly string JsResourcePath;
    public readonly string LangId;

    public WebUiPageDefinition(Type source,
        string url,
        string jsResourcePath, 
        string langId)
    {
        Source = source;
        JsResourcePath = jsResourcePath;
        LangId = langId;

        PathDocument = url;
        PathJavaScript = $"/static/webui/js/{url.GetHashString()}.js";
    }
}
