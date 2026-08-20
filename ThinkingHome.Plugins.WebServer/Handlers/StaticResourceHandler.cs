using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class StaticResourceHandler : BaseHandler
    {
        /// <summary>
        /// Вариант ресурса: путь к нему и заголовки, с которыми он отдается.
        /// Заголовки не зависят от запроса, поэтому создаются один раз.
        /// </summary>
        private record ResourceVariant(string ResourcePath, IDictionary<string, string> Headers);

        private readonly Assembly assembly;
        private readonly string contentType;

        private readonly ResourceVariant original;

        /// <summary>
        /// Сжатые варианты в порядке предпочтения: имя кодировки -> вариант.
        /// </summary>
        private readonly List<KeyValuePair<string, ResourceVariant>> compressed = [];

        /// <summary>
        /// Если у ресурса есть предсжатые копии, готовый файл отдается по заголовку
        /// Accept-Encoding: сжатие не пересчитывается на каждый запрос и имеет максимальное
        /// качество. Браузеры анонсируют brotli только в защищенном контексте (HTTPS или
        /// localhost), поэтому в локальной сети используется gzip.
        /// </summary>
        public StaticResourceHandler(Type source, StaticResource resource, string contentType, Assembly assembly = null) : base(source, true)
        {
            if (string.IsNullOrWhiteSpace(contentType)) throw new ArgumentNullException(nameof(contentType));
            if (string.IsNullOrWhiteSpace(resource.ResourcePath)) throw new ArgumentNullException(nameof(resource));

            this.contentType = contentType;
            this.assembly = assembly ?? source.Assembly;

            original = new ResourceVariant(resource.ResourcePath, null);

            if (!resource.IsCompressed) return;

            // указан только один сжатый вариант: это ошибка регистрации, а не повод
            // отдавать часть клиентов несжатыми
            if (string.IsNullOrWhiteSpace(resource.GzipResourcePath)) throw new ArgumentNullException(nameof(resource.GzipResourcePath));
            if (string.IsNullOrWhiteSpace(resource.BrotliResourcePath)) throw new ArgumentNullException(nameof(resource.BrotliResourcePath));

            compressed.Add(new("br", new ResourceVariant(resource.BrotliResourcePath, CreateHeaders("br"))));
            compressed.Add(new("gzip", new ResourceVariant(resource.GzipResourcePath, CreateHeaders("gzip"))));

            // ответ зависит от заголовка запроса даже когда отдается несжатый вариант
            original = original with { Headers = CreateHeaders() };
        }

        public override async Task<HttpHandlerResult> GetContent(HttpContext context)
        {
            var variant = SelectVariant(context);

            return new HttpHandlerResult
            {
                Content = await ReadResource(variant.ResourcePath),
                ContentType = contentType,
                Headers = variant.Headers
            };
        }

        #region private

        private static ReadOnlyDictionary<string, string> CreateHeaders(string encoding = null)
        {
            var headers = new Dictionary<string, string> { { "Vary", "Accept-Encoding" } };

            if (encoding != null)
            {
                headers.Add("Content-Encoding", encoding);
            }

            return new ReadOnlyDictionary<string, string>(headers);
        }

        /// <summary>
        /// Выбирает вариант ресурса, который принимает клиент. Заголовок разбирается один
        /// раз, а варианты перебираются в порядке предпочтения: клиент перечисляет кодировки
        /// в произвольном порядке, и выбирать нужно лучшую из доступных, а не первую в списке.
        /// </summary>
        private ResourceVariant SelectVariant(HttpContext context)
        {
            if (compressed.Count == 0) return original;

            string acceptEncoding = context.Request.Headers.AcceptEncoding.ToString();
            var accepted = ParseAcceptEncoding(acceptEncoding);

            foreach (var (encoding, variant) in compressed)
            {
                if (accepted.Contains(encoding)) return variant;
            }

            return original;
        }

        /// <summary>
        /// Выделяет из заголовка названия кодировок: "gzip, deflate, br;q=0.9" -> gzip, deflate, br.
        /// Веса (q) не учитываются — порядок предпочтения задан на стороне сервера.
        /// </summary>
        private static HashSet<string> ParseAcceptEncoding(string acceptEncoding)
        {
            return acceptEncoding
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(item => item.Split(';')[0].TrimEnd())
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Читает ресурс из сборки. Отсутствие ресурса — ошибка сборки: набор вариантов
        /// задается при регистрации, поэтому подменять недостающий файл другим нельзя.
        /// </summary>
        private async Task<byte[]> ReadResource(string resourcePath)
        {
            await using var stream = assembly.GetManifestResourceStream(resourcePath);

            if (stream == null) throw new MissingManifestResourceException($"resource {resourcePath} is not found");

            var result = new byte[stream.Length];
            await stream.ReadExactlyAsync(result);

            return result;
        }

        #endregion
    }
}
