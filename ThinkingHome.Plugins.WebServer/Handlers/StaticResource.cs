namespace ThinkingHome.Plugins.WebServer.Handlers
{
    /// <summary>
    /// Встроенный в сборку файл и его предсжатые копии, если сборка их создала.
    ///
    /// Пути задаются явно и целиком: сервер не достраивает имена сжатых файлов, потому что
    /// схема имён известна только той сборке, которая эти файлы создала. Плагин, который
    /// собирает клиентскую часть через th-build, знает свою схему и указывает пути сам.
    /// </summary>
    public readonly record struct StaticResource(
        string ResourcePath,
        string GzipResourcePath = null,
        string BrotliResourcePath = null)
    {
        /// <summary>
        /// Ресурс без предсжатых копий: такие файлы сжимает сам сервер при отдаче.
        /// </summary>
        public static implicit operator StaticResource(string resourcePath) => new(resourcePath);

        public bool IsCompressed => GzipResourcePath != null || BrotliResourcePath != null;
    }
}
