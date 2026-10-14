using System;
using System.CommandLine;
using System.IO;
using System.Runtime.Loader;
using System.Threading;
using ThinkingHome.Core.Infrastructure;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackageRuntime;
using ThinkingHome.Platform;
using Terminal = System.Console;

namespace ThinkingHome.Console;

internal static class Program
{
    public static int Main(string[] args)
    {
        var app = new Option<string>("--app")
        {
            Description = "Application directory; defaults to the host directory.",
            Arity = ArgumentArity.ExactlyOne
        };

        var check = new Option<bool>("--check")
        {
            Description = "Validate plugins without starting their lifecycle."
        };

        // Библиотека проверяет аргументы и обрабатывает --help/--version до запуска хоста.
        var command = new RootCommand("ThinkingHome plugin host") { Options = { app, check } };
        command.SetAction(result => Run(result.GetValue(app), result.GetValue(check)));

        return command.Parse(args).Invoke();
    }

    private static int Run(string applicationDirectory, bool check)
    {
        PluginRuntime runtime = null;
        var app = new HomeApplication();
        var shutdownStarted = 0;

        void Shutdown()
        {
            // Main, finally и Unloading могут вызвать остановку повторно, в том числе после Environment.Exit.
            // Жизненный цикл плагинов завершаем только один раз.
            if (Interlocked.Exchange(ref shutdownStarted, 1) == 0)
            {
                app.StopServices();
            }
        }

        Action<AssemblyLoadContext> unloading = _ => Shutdown();
        using var done = new ManualResetEvent(false);

        ConsoleCancelEventHandler cancel = (_, e) =>
        {
            // Останавливаем плагины в основном потоке: длительная работа в обработчике Ctrl+C
            // и последующее принудительное завершение средствами Windows могут подвесить процесс.
            e.Cancel = true;
            done.Set();
        };

        try
        {
            var directory = Path.GetFullPath(applicationDirectory ?? AppContext.BaseDirectory);
            var platform = HostPlatform.Current();

            // Один путь запуска для установленных пакетов и локальных сборок.
            runtime = PluginRuntime.Open(directory, platform);
            var config = new HomeConfiguration(directory,
                PackageManager.GeneratedConfiguration(runtime.Plan.Lock));

            if (check)
            {
                Terminal.WriteLine("Plugin preflight succeeded; lifecycle not started");

                return 0;
            }

            // Подписки живут столько же, сколько запущенное приложение.
            AssemblyLoadContext.Default.Unloading += unloading;
            Terminal.CancelKeyPress += cancel;
            app.StartServices(config, runtime.PluginTypes);
            Terminal.WriteLine("Service is available. Press Ctrl+C to exit.");
            done.WaitOne();

            Shutdown();

            runtime.Dispose();
            runtime = null;

            // Все плагины остановлены; не ждём оставшиеся foreground-потоки.
            Environment.Exit(0);

            return 0;
        }
        catch (Exception ex)
        {
            Terminal.Error.WriteLine(ex);

            return 1;
        }
        finally
        {
            Shutdown();
            Terminal.CancelKeyPress -= cancel;
            AssemblyLoadContext.Default.Unloading -= unloading;
            runtime?.Dispose();
        }
    }
}
