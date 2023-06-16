using System.Diagnostics;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Xerox.Wnc.Common;
using Xerox.Wnc.Web.AppInsights;

namespace Xerox.Wnc.Web
{
    // Startup class
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton(Configuration);

            Trace.Listeners.Add(new Microsoft.ApplicationInsights.TraceListener.ApplicationInsightsTraceListener(Configuration["APPINSIGHTS_INSTRUMENTATIONKEY"]));

            services.AddHttpClient();

            //services.AddAzureDataProtection(Configuration);

            services.AddCors(Configuration, "Web");

            //ConfigureAuthentication(services);

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
            
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            //services
                //.AddApplicationInsightsTelemetryProcessor<NoHealthChecksTelemetryProcessor>()
               // .AddApplicationInsightsTelemetryProcessor<NoLogInfoTelementryProcessor>();
                //.AddApplicationInsightsTelemetryProcessor<NoAccessTokensTelemetryProcessor>();
        }

        private void ConfigureAuthentication(IServiceCollection services)
        {
            //services.AddIdentityAuthentication(Configuration, apiName: "xerox-wnc");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseLanguageMiddleware();

            if (!(env.IsDevelopment() || env.IsEnvironment("Local")))
            {
                app.UseHsts();
            }

            app.UseCors();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            //app.UseCookiePolicy();

            //app.UseAuthentication();
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
