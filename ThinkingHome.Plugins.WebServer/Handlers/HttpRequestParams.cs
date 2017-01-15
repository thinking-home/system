using System;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class HttpRequestParams
    {
        public readonly IQueryCollection urlData;
        public readonly IFormCollection formData;

        public HttpRequestParams(HttpRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));

            urlData = request.Query;
            formData = request.HasFormContentType ? request.Form : null;
        }

        public HttpRequestParams(IQueryCollection urlData, IFormCollection formData)
        {
            this.urlData = urlData;
            this.formData = formData;
        }

        #region params

        public string GetString(string name)
        {
            // важно неявное приведение к string, т.к. ToString
            // дополнительно заменяет null на пустую строку
            string urlValue = urlData?[name];
            string formValue = formData?[name];

            if (string.IsNullOrWhiteSpace(urlValue))
            {
                return formValue;
            }

            if (string.IsNullOrWhiteSpace(formValue))
            {
                return urlValue;
            }

            return $"{urlValue},{formValue}";
        }

        public int? GetInt32(string name)
        {
            return GetString(name).ParseInt();
        }

        public Guid? GetGuid(string name)
        {
            return GetString(name).ParseGuid();
        }

        public bool? GetBool(string name)
        {
            return GetString(name).ParseBool();
        }

        #endregion

        #region required params

        public string GetRequiredString(string name)
        {
            var value = GetString(name);

            if (string.IsNullOrEmpty(value)) throw new ArgumentException($"parameter {name} is required");

            return value;
        }

        public int GetRequiredInt32(string name)
        {
            var value = GetInt32(name);

            if (!value.HasValue) throw new ArgumentException($"parameter {name} is required");

            return value.Value;
        }

        public Guid GetRequiredGuid(string name)
        {
            var value = GetGuid(name);

            if (!value.HasValue) throw new ArgumentException($"parameter {name} is required");

            return value.Value;
        }

        public bool GetRequiredBool(string name)
        {
            var value = GetBool(name);

            if (!value.HasValue) throw new ArgumentException($"parameter {name} is required");

            return value.Value;
        }

        #endregion
    }
}
