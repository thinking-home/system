using System;
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
            var done = new AutoResetEvent(false);
            var asm = typeof(Program).GetTypeInfo().Assembly;

            Action shutdown = () =>
            {
                System.Console.WriteLine("Application is shutting down...");
                app.StopServices();
                System.Console.WriteLine("Done");
            };

            AssemblyLoadContext.GetLoadContext(asm).Unloading += context => { shutdown(); };
            System.Console.CancelKeyPress += (sender, eventArgs) => { shutdown(); };

            // wait
            System.Console.WriteLine("Service is available. Press Ctrl+C to exit.");
            done.WaitOne();
        }
    }
}
