using System;

namespace ThinkingHome.Plugins.WebServer.Attributes
{
    public class ConfigureWebServerAttribute : Attribute { }
    
    public delegate void ConfigureWebServerDelegate(WebServerConfigurationBuilder configurationBuilder);
}
