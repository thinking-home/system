using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ThinkingHome.Plugins.WebServer.Handlers
{
    public interface IHttpHandler
    {
        Task ProcessRequest(HttpContext context);
    }
}