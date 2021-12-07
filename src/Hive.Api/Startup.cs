using System.Diagnostics.CodeAnalysis;
using Hive.Converters;
using Hive.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;

namespace Hive
{
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _currentEnvironment;

        [ExcludeFromCodeCoverage]
        public Startup(IWebHostEnvironment env, IConfiguration configuration)
        {
            _currentEnvironment = env;
            _configuration = configuration;
        }

        [ExcludeFromCodeCoverage]
        public void ConfigureServices(IServiceCollection services)
        {
            var sigR = services.AddSignalR()
                .AddJsonProtocol(options => { options.PayloadSerializerOptions.Converters.AddAllJsonConverters(); });

            if (_currentEnvironment.IsProduction())
            {
                services.AddStackExchangeRedisCache(options =>
                {
                    options.Configuration = _configuration["RedisHost"];
                    options.ConfigurationOptions.AbortOnConnectFail = false;
                });
                
                sigR.AddStackExchangeRedis(_configuration["RedisHost"], options => options.Configuration.AbortOnConnectFail = false);
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            services.AddControllers()
                .AddJsonOptions(options => { options.JsonSerializerOptions.Converters.AddAllJsonConverters(); });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        [ExcludeFromCodeCoverage]
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseHttpsRedirection();
            }

            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = ctx =>
                {
                    if (ctx.File.Name != "index.html")
                    {
                        const int durationInSeconds = 31536000;
                        ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=" + durationInSeconds;
                    }
                }
            });

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub/{id}/{playerId}");
            });
        }
    }
}
