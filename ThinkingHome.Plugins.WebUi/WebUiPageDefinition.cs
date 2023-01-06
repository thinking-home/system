using System.Security.Cryptography;
using System.Text;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    public readonly string PathDocument;
    public readonly string PathJavaScript;

    public readonly Type Source;
    public readonly string JsResourcePath;

    public WebUiPageDefinition(
        Type source,
        string url,
        string jsResourcePath)
    {
        Source = source;
        JsResourcePath = jsResourcePath;

        var hashBytes = MD5.HashData(Encoding.UTF8.GetBytes(url));
        var hash = string.Join("", hashBytes.Select(x => x.ToString("x2")));
        
        PathDocument = url;
        PathJavaScript = $"/static/webui/js/{hash}.js";
    }
}
