using System.Security.Cryptography;
using System.Text;

namespace ThinkingHome.Plugins.WebUi;

public class WebUiPageDefinition
{
    public readonly string PathDocument;
    public readonly string PathJavaScript;
    public readonly string? PathStylesheet;

    public readonly Type Source;
    public readonly string JsResourcePath;
    public readonly string? CssResourcePath;

    public WebUiPageDefinition(
        Type source,
        string url,
        string jsResourcePath,
        string? cssResourcePath = null)
    {
        Source = source;
        JsResourcePath = jsResourcePath;
        CssResourcePath = cssResourcePath;

        var hashBytes = MD5.HashData(Encoding.UTF8.GetBytes(url));
        var hash = string.Join("", hashBytes.Select(x => x.ToString("x2")));
        
        PathDocument = url;
        PathJavaScript = $"/static/webui/js/{hash}.js";
        PathStylesheet = string.IsNullOrEmpty(CssResourcePath) ? null : $"/static/webui/css/{hash}.css";
    }
}
