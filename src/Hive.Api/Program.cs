using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Hive.Api;

[ExcludeFromCodeCoverage]
public static class Program
{
    [ExcludeFromCodeCoverage]
    public static void Main(string[] args)
    {
        CreateWebHostBuilder(args).Build().Run();
    }

    [ExcludeFromCodeCoverage]
    // ReSharper disable once MemberCanBePrivate.Global
    public static IWebHostBuilder CreateWebHostBuilder(string[] args)
    {
        return WebHost.CreateDefaultBuilder(args)
            .ConfigureAppConfiguration(
                (context, _) =>
                {
                    if (context.HostingEnvironment.IsProduction()) return;

                    var webRoot = context.HostingEnvironment.ContentRootPath + "/wwwroot";
                    context.HostingEnvironment.WebRootFileProvider = new PhysicalFileProvider(webRoot);
                }
            )
            .UseStartup<Startup>();
    }
}
