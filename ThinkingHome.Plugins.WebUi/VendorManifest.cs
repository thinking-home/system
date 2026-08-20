using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ThinkingHome.Plugins.WebUi;

/// <summary>
/// Манифест vendor-модулей, который генерирует сборка @thinking-home/ui.
/// </summary>
public class VendorManifest {
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
