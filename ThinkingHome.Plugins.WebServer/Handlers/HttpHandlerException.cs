using System;

namespace ThinkingHome.Plugins.WebServer.Handlers;

public enum StatusCode {
    BadRequest = 400,
    Internal = 500,
}

public class HttpHandlerException : Exception {
    public StatusCode StatusCode { get; }

    public HttpHandlerException(StatusCode statusCode, string message = null) : base(message)
    {
        StatusCode = statusCode;
    }
}
