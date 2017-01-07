namespace ThinkingHome.Plugins.WebServer
{
    public delegate object HttpHandlerDelegate();

    public delegate void RegisterHttpHandlerDelegate(string path, HttpHandlerDelegate method);

    public interface IHttpApiOwner
    {
        void RegisterHandlers(RegisterHttpHandlerDelegate addHandler);
    }
}