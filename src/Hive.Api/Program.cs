using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

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
          
            .UseStartup<Startup>();
    }
}
