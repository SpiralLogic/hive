using System.IO;
using System.Net;
using Hive.Api.Converters;
using Hive.Api.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;

var appBuilder = WebApplication.CreateBuilder(args);
var services = appBuilder.Services;

var signalR = services.AddSignalR().AddJsonProtocol(options => { options.PayloadSerializerOptions.Converters.AddAllJsonConverters(); });

if (appBuilder.Environment.IsDevelopment())
{
    services.AddDistributedMemoryCache();
}
else
{
    services.AddStackExchangeRedisCache(
        options =>
        {
            options.Configuration = appBuilder.Configuration["RedisHost"];
        }
    );
    var regisConfig = appBuilder.Configuration["RedisHost"];
    if (regisConfig != null) signalR.AddStackExchangeRedis(regisConfig);
}

services.AddControllers().AddJsonOptions(options => { options.JsonSerializerOptions.Converters.AddAllJsonConverters(); });

using var app = appBuilder.Build();

if (app.Environment.IsDevelopment())
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
                if (ctx.File.Name.EndsWith(".js") || ctx.File.Name.EndsWith(".css")|| ctx.File.Name.EndsWith(".webmanifest"))
                    ctx.Context.Response.Headers.ContentType += "; charset=utf-8";
                if (ctx.File.Name == "index.html") return;
                var oneWeekSeconds = (60 * 60 * 24 * 7).ToString();
                ctx.Context.Response.Headers[HeaderNames.CacheControl] = $"public, max-age={oneWeekSeconds}";
            }
        }
    }
);

app.UseRouting();
app.MapControllers();
app.MapHub<GameHub>("/gamehub/{id}/{playerId}");
app.Run();

public partial class Program
{
}
