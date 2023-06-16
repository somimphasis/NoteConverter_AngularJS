using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace Xerox.Wnc.Common
{
    public static class CorsExtensions
    {
        public static IServiceCollection AddCors(this IServiceCollection services, IConfiguration configuration, string key)
        {
            var origins = (configuration[$"WNC:{key}:Cors:Origins"] ?? string.Empty)
                .Split(",;".ToArray(), StringSplitOptions.RemoveEmptyEntries)
                .Where(x => x.Trim() != string.Empty)
                .ToArray();

            if (origins.Any())
            {
                services.AddCors(options =>
                {
                    options.AddDefaultPolicy(builder =>
                    {
                        builder.WithOrigins(origins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
                });
            }

            return services;
        }
    }
}
