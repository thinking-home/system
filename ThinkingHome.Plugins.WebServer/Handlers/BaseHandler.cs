using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Attributes.Base;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public interface IHandler
    {
        bool IsCached { get; }

        string CacheKey { get; }

        string ContentType { get; }

        Task<byte[]> GetContent(HttpContext context);
    }

    public abstract class BaseHandler<TResource> : IHandler where TResource : HttpResourceAttribute
    {
        protected BaseHandler(TResource resource)
        {
            Resource = resource;
        }

        public TResource Resource { get; }

        public bool IsCached => Resource.IsCached;

        public string CacheKey => $"B746CB6C-D767-4AD8-B3F5-CD7FADEAD51A:{Resource.Url}";

        public string ContentType => Resource.ContentType;

        public abstract Task<byte[]> GetContent(HttpContext context);
    }
}