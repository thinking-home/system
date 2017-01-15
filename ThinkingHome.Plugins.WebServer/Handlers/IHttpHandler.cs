using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public interface IHttpHandler
    {
        Task ProcessRequest(HttpContext context, IMemoryCache cache);
    }
}