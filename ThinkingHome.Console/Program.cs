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
            var shutdownStarted = 0;

            void Shutdown()
            {
                // Shutdown подписан на несколько событий (Ctrl+C и выгрузка сборок),
                // а останавливать плагины нужно не больше одного раза
                if (Interlocked.Exchange(ref shutdownStarted, 1) != 0) return;

                System.Console.WriteLine("\nApplication is shutting down...");
                app.StopServices();
                System.Console.WriteLine("Done");
            }

            AssemblyLoadContext.Default.Unloading += context => { Shutdown(); };
            System.Console.CancelKeyPress += (sender, eventArgs) => { Shutdown(); };

            // wait
            System.Console.WriteLine("Service is available. Press Ctrl+C to exit.");
            var done = new AutoResetEvent(false);
            done.WaitOne();
        }
    }
}
