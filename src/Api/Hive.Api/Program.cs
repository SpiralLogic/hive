using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace Hive
{
    public static class Program
    {
        [ExcludeFromCodeCoverage]
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        [ExcludeFromCodeCoverage]
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    if (context.HostingEnvironment.IsDevelopment())
                    {
                        var webRoot = context.HostingEnvironment.ContentRootPath + "/../../FrontEnd/public";
                        context.HostingEnvironment.WebRootFileProvider =
                            new PhysicalFileProvider(webRoot);
                    }
                }).UseStartup<Startup>();
    }
}
