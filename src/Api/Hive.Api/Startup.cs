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
        private readonly IWebHostEnvironment _currentEnvironment;
        private readonly IConfiguration _configuration;

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
                .AddJsonProtocol(options =>
                {
                    options.PayloadSerializerOptions.Converters.Add(new CreatureJsonConverter());
                    options.PayloadSerializerOptions.Converters.Add(new StackJsonConverter());
                });

            if (_currentEnvironment.IsProduction())
            {
                services.AddStackExchangeRedisCache(options => options.Configuration = _configuration["RedisHost"]);
                sigR.AddStackExchangeRedis(_configuration["RedisHost"]);
            }
            else
            {
                services.AddDistributedMemoryCache();
            }

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new CreatureJsonConverter());
                    options.JsonSerializerOptions.Converters.Add(new StackJsonConverter());
                });
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
                    const int durationInSeconds = 60 * 60 * 24;
                    ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                        "public,max-age=" + durationInSeconds;
                },
            });

            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub/{id}");
            });
        }
    }
}
