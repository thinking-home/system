using System;
using System.Linq;
using System.Reflection;
using System.Runtime.Loader;
using System.Threading;
using ThinkingHome.Core.Infrastructure;

namespace ThinkingHome.Console
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            // init and start
            var config = new HomeConfiguration();
            var app = new HomeApplication();

            app.StartServices(config);

            // finalize
            Action shutdown = () =>
            {
                System.Console.WriteLine("Application is shutting down...");
                app.StopServices();
                System.Console.WriteLine("Done");
            };

            AssemblyLoadContext.Default.Unloading += context => { shutdown(); };
            System.Console.CancelKeyPress += (sender, eventArgs) => { shutdown(); };

            // wait
            if (args.Any(value => value == "-enter"))
            {
                System.Console.WriteLine("Service is available. Press ENTER to exit.");
                System.Console.ReadLine();
            }
            else
            {
                System.Console.WriteLine("Service is available. Press Ctrl+C to exit.");
                var done = new AutoResetEvent(false);
                done.WaitOne();
            }
        }
    }
}
