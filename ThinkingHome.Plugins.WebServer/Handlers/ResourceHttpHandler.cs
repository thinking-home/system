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
        private const int CACHE_EXPIRATION = 7200; // в секундах (7200 == 2 часа)

        private readonly string cacheKey;
        private readonly object lockObj = new object();

        private readonly Assembly assembly;
        private readonly HttpResourceAttribute resource;

        public ResourceHttpHandler(Assembly assembly, HttpResourceAttribute resource)
        {
            this.assembly = assembly;
            this.resource = resource;
            this.cacheKey = $"B746CB6C-D767-4AD8-B3F5-CD7FADEAD51A:{resource.Url}";
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

            if (cache.TryGetValue(cacheKey, out result)) return result;

            lock (lockObj)
            {
                if (cache.TryGetValue(cacheKey, out result)) return result;

                result = resource.GetContent(assembly);
                cache.Set(cacheKey, result, TimeSpan.FromSeconds(CACHE_EXPIRATION));
            }

            return result;
        }
    }
}