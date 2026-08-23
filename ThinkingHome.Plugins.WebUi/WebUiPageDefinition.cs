using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    public readonly string PathDocument;
    public readonly string PathJavaScript;

    public readonly Type Source;
    public readonly StaticResource Js;
    public readonly string LangId;

    public WebUiPageDefinition(Type source,
        string url,
        StaticResource js, 
        string langId)
    {
        Source = source;
        Js = js;
        LangId = langId;

        PathDocument = url;
        PathJavaScript = $"/static/webui/js/{url.GetHashString()}.js";
    }
}
