namespace ThinkingHome.Plugins.WebServer
{
    public interface IWillUseWebServer
    {
        void RegisterHttpHandlers(WebServerConfigBuilder cfg);
    }
}
