using System;
using System.Threading;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Xerox.Wnc.Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //Networking takes a little while to wake up on Azure
            if (bool.Parse(Environment.GetEnvironmentVariable("DelayStartup") ?? "true"))
            {
                Thread.Sleep(45000);
            }

            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
        }
    }
}
