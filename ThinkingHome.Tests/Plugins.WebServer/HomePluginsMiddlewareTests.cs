using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging.Abstractions;
using ThinkingHome.Core.Plugins.Utils;
using ThinkingHome.Plugins.WebServer.Handlers;
using Xunit;

namespace ThinkingHome.Tests.Plugins.WebServer
{
    [Trait("capability", "plugins/web-server/http-resources")]
    public class HomePluginsMiddlewareTests
    {
        /// <summary>
        /// Тестовый обработчик: считает вызовы и возвращает ответ, зависящий от строки запроса.
        /// </summary>
        private class CountingHandler : BaseHandler
        {
            public int InvocationCount { get; private set; }

            public CountingHandler(bool isCached) : base(typeof(CountingHandler), isCached)
            {
            }

            public override Task<HttpHandlerResult> GetContent(HttpContext context)
            {
                InvocationCount++;

                var query = context.Request.QueryString.Value;

                return Task.FromResult(HttpHandlerResult.Text($"response for {query}"));
            }
        }

        private static (HttpContext context, MemoryStream body) CreateContext(string path, string queryString)
        {
            var context = new DefaultHttpContext();
            context.Request.Path = path;
            context.Request.QueryString = new QueryString(queryString);
            var body = new MemoryStream();
            context.Response.Body = body;

            return (context, body);
        }

        private static async Task<string> InvokeAndReadResponse(ThinkingHome.Plugins.WebServer.HomePluginsMiddleware middleware, HttpContext context, MemoryStream body)
        {
            await middleware.Invoke(context);

            body.Position = 0;

            using var reader = new StreamReader(body);

            return await reader.ReadToEndAsync();
        }

        private static ThinkingHome.Plugins.WebServer.HomePluginsMiddleware CreateMiddleware(ObjectRegistry<BaseHandler> handlers, IMemoryCache cache)
        {
            return new ThinkingHome.Plugins.WebServer.HomePluginsMiddleware(
                handlers,
                _ => Task.CompletedTask,
                NullLoggerFactory.Instance,
                cache);
        }

        [Fact(DisplayName = "plugins/web-server/http-resources › Динамический ресурс генерируется на каждый запрос › Запрос динамического ресурса вызывает обработчик")]
        public async Task Invoke_CallsRegisteredHandler_AndReturnsItsResult()
        {
            var handlers = new ObjectRegistry<BaseHandler>();
            var handler = new CountingHandler(isCached: false);
            handlers.Register("/dynamic/test/resource", handler);

            using var cache = new MemoryCache(new MemoryCacheOptions());
            var middleware = CreateMiddleware(handlers, cache);

            var (context, body) = CreateContext("/dynamic/test/resource", "");
            var response = await InvokeAndReadResponse(middleware, context, body);

            Assert.Equal(1, handler.InvocationCount);
            Assert.Equal("response for ", response);
        }

        [Fact(DisplayName = "plugins/web-server/http-resources › Динамический ресурс генерируется на каждый запрос › Некэшируемый динамический ресурс")]
        public async Task Invoke_SetsNoCacheHeader_WhenHandlerIsNotCached()
        {
            var handlers = new ObjectRegistry<BaseHandler>();
            var handler = new CountingHandler(isCached: false);
            handlers.Register("/dynamic/test/resource", handler);

            using var cache = new MemoryCache(new MemoryCacheOptions());
            var middleware = CreateMiddleware(handlers, cache);

            var (context1, body1) = CreateContext("/dynamic/test/resource", "");
            await InvokeAndReadResponse(middleware, context1, body1);
            var (context2, body2) = CreateContext("/dynamic/test/resource", "");
            await InvokeAndReadResponse(middleware, context2, body2);

            Assert.Equal(2, handler.InvocationCount);
            Assert.Equal("no-cache, no-store", context1.Response.Headers["Cache-Control"]);
            Assert.Equal("no-cache, no-store", context2.Response.Headers["Cache-Control"]);
        }

        [Fact(DisplayName = "plugins/web-server/http-resources › Динамический ресурс генерируется на каждый запрос › Кэшируемый ресурс с разными параметрами строки запроса")]
        public async Task Invoke_CallsHandlerForNewQueryString_WhenCachedResourceRequestedWithDifferentParams()
        {
            var handlers = new ObjectRegistry<BaseHandler>();
            var handler = new CountingHandler(isCached: true);
            handlers.Register("/dynamic/test/resource", handler);

            using var cache = new MemoryCache(new MemoryCacheOptions());
            var middleware = CreateMiddleware(handlers, cache);

            var (contextA, bodyA) = CreateContext("/dynamic/test/resource", "?id=A");
            var responseA = await InvokeAndReadResponse(middleware, contextA, bodyA);

            var (contextB, bodyB) = CreateContext("/dynamic/test/resource", "?id=B");
            var responseB = await InvokeAndReadResponse(middleware, contextB, bodyB);

            Assert.Equal("response for ?id=A", responseA);
            Assert.Equal("response for ?id=B", responseB);
            Assert.Equal(2, handler.InvocationCount);
        }

        [Fact(DisplayName = "plugins/web-server/http-resources › Динамический ресурс генерируется на каждый запрос › Повторный запрос с той же строкой запроса")]
        public async Task Invoke_CallsHandlerOnce_WhenSameQueryStringRequestedTwice()
        {
            var handlers = new ObjectRegistry<BaseHandler>();
            var handler = new CountingHandler(isCached: true);
            handlers.Register("/dynamic/test/resource", handler);

            using var cache = new MemoryCache(new MemoryCacheOptions());
            var middleware = CreateMiddleware(handlers, cache);

            var (context1, body1) = CreateContext("/dynamic/test/resource", "?id=A");
            var response1 = await InvokeAndReadResponse(middleware, context1, body1);

            var (context2, body2) = CreateContext("/dynamic/test/resource", "?id=A");
            var response2 = await InvokeAndReadResponse(middleware, context2, body2);

            Assert.Equal(1, handler.InvocationCount);
            Assert.Equal(response1, response2);
        }
    }
}
