namespace ThinkingHome.Plugins.WebUi.Attributes;

public class ConfigureWebUiAttribute: Attribute { }

public delegate void ConfigureWebUiDelegate(WebUiConfigurationBuilder config);

