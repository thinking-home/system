using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public abstract class BaseHandler
    {
        protected BaseHandler(bool isCached)
        {
            IsCached = isCached;
        }

        public bool IsCached { get; }

        public abstract Task<HttpHandlerResult> GetContent(HttpContext context);
    }
}
