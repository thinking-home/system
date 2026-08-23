using System.Text.Json.Serialization;

namespace ThinkingHome.Plugins.WebUi;

/// <summary>
/// Цветовая схема веб-интерфейса. Задает, светлое оформление или темное;
/// как именно выглядит интерфейс внутри выбранной схемы, решает клиент.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter<WebUiTheme>))]
public enum WebUiTheme
{
    [JsonStringEnumMemberName("light")]
    Light,

    [JsonStringEnumMemberName("dark")]
    Dark
}
