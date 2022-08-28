using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public abstract class BaseHandler
    {
        protected BaseHandler(Type source, bool isCached)
        {
            Source = source;
            IsCached = isCached;
        }

        public bool IsCached { get; }
        public Type Source { get; }

        public abstract Task<HttpHandlerResult> GetContent(HttpContext context);
    }
}
