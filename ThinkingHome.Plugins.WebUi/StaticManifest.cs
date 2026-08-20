using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ThinkingHome.Plugins.WebUi;

/// <summary>
/// Манифест собранной статики, который генерируют сборки на основе @thinking-home/ui:
/// vendor-модули, main.js веб-интерфейса и бандлы разделов плагинов. У бандлов
/// заполнен только раздел files, у vendor-модулей еще imports.
/// </summary>
public class StaticManifest {
    /// <summary>
    /// Соответствие имени импорта файлу бандла (react-dom -> react.js).
    /// </summary>
    [JsonPropertyName("imports")]
    public Dictionary<string, string> Imports { get; init; } = new();

    /// <summary>
    /// Сжатые варианты каждого бандла: имя кодировки -> имя файла.
    /// </summary>
    [JsonPropertyName("files")]
    public Dictionary<string, Dictionary<string, string>> Files { get; init; } = new();
}
