using ThinkingHome.Plugins.WebServer.Handlers.Api;

namespace ThinkingHome.Plugins.WebServer
{
    public delegate object HttpHandlerDelegate(HttpRequestParams requestParams);

    public delegate void RegisterHttpHandlerDelegate(string path, HttpHandlerDelegate method);

    public interface IHttpApiOwner
    {
        void RegisterHandlers(RegisterHttpHandlerDelegate addHandler);
    }
}
