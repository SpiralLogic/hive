using System.Diagnostics.CodeAnalysis;
using Hive.Converters;
using Hive.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Hive
{
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

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
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
            app.UseStaticFiles();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub/{id}");
            });
        }
    }
}
