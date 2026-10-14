using System;
using System.Globalization;
using System.IO;
using Microsoft.Extensions.Configuration;
using Serilog;

namespace ThinkingHome.Core.Infrastructure
{
    /// <summary>
    /// Объединяет настройки приложения из файлов и переменных окружения.
    /// </summary>
    public class HomeConfiguration
    {
        /// <summary>
        /// Итоговые настройки с учётом файлов конфигурации и переменных окружения.
        /// </summary>
        public readonly IConfiguration Configuration;

        /// <summary>
        /// Настройки журналирования, полученные из конфигурации приложения.
        /// </summary>
        public readonly LoggerConfiguration LoggerConfiguration;

        /// <summary>
        /// Имя окружения из THINKINGHOME_ENVIRONMENT; не определяет способ загрузки плагинов.
        /// </summary>
        public readonly string Environment;

        /// <summary>
        /// Создаёт конфигурацию указанного каталога; пользовательские настройки перекрывают сгенерированные.
        /// </summary>
        /// <param name="applicationDirectory">Базовый каталог файлов конфигурации; null означает текущий каталог.</param>
        /// <param name="generatedConfiguration">Необязательная базовая конфигурация в UTF-8 JSON.</param>
        public HomeConfiguration(string applicationDirectory, byte[] generatedConfiguration = null)
        {
            Environment = System.Environment.GetEnvironmentVariable("THINKINGHOME_ENVIRONMENT");

            // Порядок источников задаёт приоритет: сгенерированные значения, файлы, окружение.
            var builder = new ConfigurationBuilder().SetBasePath(applicationDirectory ?? Directory.GetCurrentDirectory());

            if (generatedConfiguration != null)
            {
                builder.AddJsonStream(new MemoryStream(generatedConfiguration));
            }

            builder.AddJsonFile("appsettings.json", true);

            if (!String.IsNullOrWhiteSpace(Environment))
            {
                builder.AddJsonFile($"appsettings.{Environment}.json", optional: true);
            }

            builder.AddEnvironmentVariables("THINKINGHOME_");
            Configuration = builder.Build();
            LoggerConfiguration = new LoggerConfiguration().ReadFrom.Configuration(Configuration);
        }

        /// <summary>
        /// Возвращает секцию настроек плагина по полному имени его типа.
        /// </summary>
        public IConfigurationSection GetPluginSection(Type type)
        {
            return Configuration.GetSection($"plugins:{type.FullName}");
        }

        /// <summary>
        /// Возвращает культуру приложения или инвариантную культуру, если настройка отсутствует.
        /// </summary>
        public CultureInfo GetCulture()
        {
            var cultureName = Configuration["culture"] ?? string.Empty;

            return CultureInfo.GetCultureInfo(cultureName);
        }
    }
}
