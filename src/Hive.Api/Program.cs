using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Hive
{
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
                .ConfigureAppConfiguration((context, _) =>
                {
                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        var webRoot = context.HostingEnvironment.ContentRootPath + "/../../Hive.FrontEnd/public";
                        context.HostingEnvironment.WebRootFileProvider = new PhysicalFileProvider(webRoot);
                    }
                })
                .UseStartup<Startup>();
        }
    }
}
