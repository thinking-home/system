using System;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using ThinkingHome.Plugins.WebServer.Attributes;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public class ResourceHttpHandler : IHttpHandler
    {
        // cache params
        private const string CACHE_KEY = "1AD07B08-E047-4593-A169-7BE44A633639";
        private const int CACHE_EXPIRATION = 7200; // в секундах (7200 == 2 часа)
        private readonly object lockObj = new object();

        private readonly Assembly assembly;
        private readonly HttpResourceAttribute resource;

        public ResourceHttpHandler(Assembly assembly, HttpResourceAttribute resource)
        {
            this.assembly = assembly;
            this.resource = resource;
        }

        public async Task ProcessRequest(HttpContext context, IMemoryCache cache)
        {
            byte[] data = await Task.Run(() => GetResourceData(cache));

            context.Response.Headers["Cache-Control"] = $"private, max-age={CACHE_EXPIRATION}";
            context.Response.ContentType = resource.ContentType;
            context.Response.ContentLength = data.Length;

            await context.Response.Body.WriteAsync(data, 0, data.Length);
        }

        private byte[] GetResourceData(IMemoryCache cache)
        {
            byte[] result;

            if (cache.TryGetValue(CACHE_KEY, out result)) return result;

            lock (lockObj)
            {
                if (cache.TryGetValue(CACHE_KEY, out result)) return result;

                result = resource.GetContent(assembly);
                cache.Set(CACHE_KEY, result, TimeSpan.FromSeconds(CACHE_EXPIRATION));
            }

            return result;
        }
    }
}