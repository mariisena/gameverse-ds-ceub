using System.Net;
using System.Text.Json;

namespace GameVerse.API.Middleware;

public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ocorreu uma exceção não tratada: {Message}", ex.Message);

            context.Response.ContentType = "application/json";
            var response = context.Response;

            object errorResponse;
            switch (ex)
            {
                case UnauthorizedAccessException:
                    response.StatusCode = (int)HttpStatusCode.Forbidden;
                    errorResponse = new { message = ex.Message };
                    break;
                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse = new { message = ex.Message };
                    break;
                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse = new 
                    {
                        message = "Ocorreu um erro interno no servidor.",
                        details = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null
                    };
                    break;
            }

            var result = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(result);
        }
    }
}