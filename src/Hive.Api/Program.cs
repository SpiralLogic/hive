using System;
using System.Globalization;
using System.Text;
using System.Threading;
using Hive.Api;
using Hive.Api.Converters;
using Hive.Api.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using Unleash;
using Unleash.ClientFactory;
using Unleash.Events;

var appBuilder = WebApplication.CreateBuilder(args);
var services = appBuilder.Services;

var signalR = services.AddSignalR().AddJsonProtocol(options => { options.PayloadSerializerOptions.Converters.AddAllJsonConverters(); });

// Add to Container as Singleton
// .NET Core 3/.NET 5/...
services.AddSingleton<IUnleash>(c =>
{
    var settings = new UnleashSettings()
    {

        AppName = "dotnet",
        UnleashApi = new("https://unleashed.lab.sorijen.net.au/api"),
        CustomHttpHeaders = new()
        {
            {
                "Authorization", "default:development.bbb22fb98da40d47326763d46ae0724f63f080d673f6c1f5f6ddf7ae"
            }

        },
        ProjectId = "default",
    };


    var unleashFactory = new UnleashClientFactory();

    IUnleash unleash = unleashFactory.CreateClient(settings, synchronousInitialization: true);
    var logger = c.GetService<ILogger<DefaultUnleash>>()!;
    unleash.ConfigureEvents(cfg =>
    {
        cfg.ErrorEvent = evt =>
        {
            LogUnleashError(logger, evt.ErrorType + " " + evt.Error?.Source);
        };

        cfg.TogglesUpdatedEvent = evt =>
        {
            LogUnleashError(logger, evt.UpdatedOn.ToString(CultureInfo.InvariantCulture));
        };
    });

    return unleash;
});


if (appBuilder.Environment.IsProduction() && !string.IsNullOrEmpty(appBuilder.Configuration["RedisHost"]))
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
{
    app.UseDeveloperExceptionPage();
    app.UseHttpsRedirection();
}

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

app.UseRouting();
app.MapControllers();
app.MapHub<GameHub>("/gamehub/{id}/{playerId}");
app.Run();

internal partial class Program
{
    [LoggerMessage(Level = LogLevel.Error, Message = "{ErrorType} occured.")]
    static partial void LogUnleashError(ILogger logger, string errorType);
}