using Hive.Converters;
using Hive.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Hive
{
    public class Startup
    {
        private readonly IWebHostEnvironment _currentEnvironment;
        public Startup(IWebHostEnvironment env)
        {
            _currentEnvironment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
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
                services.AddStackExchangeRedisCache(options => options.Configuration = "redis-cluster:6379");
                sigR.AddStackExchangeRedis("redis-cluster:6379");

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
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            //    app.UseHttpsRedirection();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<GameHub>("/gamehub");
            });
        }
    }
}
