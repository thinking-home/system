using System.Collections.Generic;
using System.Text;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class HttpHandlerResult
    {
        public string ContentType { get; init; }
        public byte[] Content { get; init; }

        /// <summary>
        /// Дополнительные заголовки ответа. Записываются после остальных, поэтому
        /// могут переопределить заголовки, которые выставляет сервер.
        /// </summary>
        public IDictionary<string, string> Headers { get; init; }

        public static HttpHandlerResult Json(object obj)
        {
            var json = obj.ToJson("null");

            return new HttpHandlerResult {
                Content = Encoding.UTF8.GetBytes(json),
                ContentType = "application/json;charset=utf-8",
            };
        }

        public static HttpHandlerResult Text(string text)
        {
            return new HttpHandlerResult {
                Content = Encoding.UTF8.GetBytes(text),
                ContentType = "text/plain;charset=utf-8",
            };
        }

        public static HttpHandlerResult Binary(byte[] bytes, string contentType = "application/octet-stream")
        {
            return new HttpHandlerResult {
                Content = bytes,
                ContentType = contentType,
            };
        }
    }
}
