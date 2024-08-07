using System;
using System.Globalization;
using System.Threading;
using Hive.Api.Converters;
using Hive.Api.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;

var appBuilder = WebApplication.CreateBuilder(args);

var services = appBuilder.Services;
services.AddW3CLogging(options => { options.LoggingFields = W3CLoggingFields.All; });
services.AddHealthChecks();
var signalR = services.AddSignalR().AddJsonProtocol(options => { options.PayloadSerializerOptions.Converters.AddAllJsonConverters(); });

if (!string.IsNullOrEmpty(appBuilder.Configuration["RedisHost"]))
{
    ThreadPool.SetMinThreads(10, 10);
    services.AddStackExchangeRedisCache(
        options =>
        {
            options.Configuration = appBuilder.Configuration["RedisHost"];
        }
    );
    var regisConfig = appBuilder.Configuration["RedisHost"];
    if (regisConfig != null) signalR.AddStackExchangeRedis(regisConfig);
}
else
{
    services.AddDistributedMemoryCache();
}

services.AddControllers().AddJsonOptions(options => { options.JsonSerializerOptions.Converters.AddAllJsonConverters(); });

using var app = appBuilder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseHttpsRedirection();
    app.UseW3CLogging();
    app.UseStaticFiles();
}
else
{
    app.UseFileServer(
        new FileServerOptions
        {
            StaticFileOptions =
            {
                OnPrepareResponse = ctx =>
                {
                    if (ctx.File.Name.EndsWith(".js", StringComparison.InvariantCultureIgnoreCase) ||
                        ctx.File.Name.EndsWith(".css", StringComparison.InvariantCultureIgnoreCase) ||
                        ctx.File.Name.EndsWith(".webmanifest", StringComparison.InvariantCultureIgnoreCase))
                        ctx.Context.Response.Headers.ContentType += "; charset=utf-8";
                    ctx.Context.Response.Headers[HeaderNames.XContentTypeOptions] = "nosniff";
                    if (ctx.File.Name == "index.html") return;
                    var oneWeekSeconds = (60 * 60 * 24 * 7).ToString(CultureInfo.InvariantCulture);
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] = $"public, max-age={oneWeekSeconds}";
                }
            }
        }
    );
}
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Content-Security-Policy", "default-src 'self'; object-src 'none'; script-src 'self'; frame-ancestors 'none'");
    context.Response.Headers.Append("Referrer-Policy","strict-origin-when-cross-origin");
    context.Response.Headers.Append("Cross-Origin-Resource-Policy","same-origin");
    await next().ConfigureAwait(false);
});

app.UseRouting();
app.MapControllers();
app.MapHub<GameHub>("/gamehub/{id}/{playerId}", options => { options.AllowStatefulReconnects = true; });
app.MapFallbackToFile("/index.html");
app.Run();

public partial class Program
{
}