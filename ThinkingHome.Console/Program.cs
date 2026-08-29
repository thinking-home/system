using System;
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
                // Shutdown вызывается из Main и из обработчика Unloading, который
                // срабатывает при любом завершении процесса — в том числе после
                // Environment.Exit в конце Main. Останавливать плагины нужно
                // не больше одного раза.
                if (Interlocked.Exchange(ref shutdownStarted, 1) != 0) return;

                System.Console.WriteLine("\nApplication is shutting down...");
                app.StopServices();
                System.Console.WriteLine("Done");
            }

            AssemblyLoadContext.Default.Unloading += context => { Shutdown(); };

            // wait
            var done = new AutoResetEvent(false);

            System.Console.CancelKeyPress += (sender, eventArgs) => {
                // Работа выносится из обработчика в основной поток: долгая остановка
                // на потоке консольного обработчика и силовое завершение процесса
                // после него (ExitProcess из default-обработчика ОС) ненадежны на
                // Windows — процесс мог остаться висеть. Отменяем силовое завершение
                // и выходим сами.
                eventArgs.Cancel = true;
                done.Set();
            };

            System.Console.WriteLine("Service is available. Press Ctrl+C to exit.");
            done.WaitOne();

            Shutdown();

            // не ждем оставшиеся потоки: все плагины уже остановлены
            Environment.Exit(0);
        }
    }
}
