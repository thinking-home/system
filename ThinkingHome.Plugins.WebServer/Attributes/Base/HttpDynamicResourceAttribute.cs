using System;

namespace ThinkingHome.Plugins.WebServer.Attributes.Base
{
    /// <summary>
    /// HTTP ресурс с динамически формируемым содержимым (не кэшируется)
    /// </summary>
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
    public abstract class HttpDynamicResourceAttribute : HttpResourceAttribute
    {
        protected HttpDynamicResourceAttribute(string url, string contentType)
            :base(url, contentType, false)
        {
        }

        /// <summary>
        /// Преобразует результат работы метода в массив байтов, который будет отправлен на клиент
        /// </summary>
        public abstract byte[] PrepareResult(object methodResult);
    }
}