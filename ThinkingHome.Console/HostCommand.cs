using System;
using System.CommandLine;
using System.IO;
using System.Runtime.Loader;
using System.Threading;
using ThinkingHome.Core.Infrastructure;
using Terminal = System.Console;

namespace ThinkingHome.Console;

internal static class HostCommand
{
    public static Command Create()
    {
        var command = new Command("run", "Run the ThinkingHome plugin host.");
        var app = new Option<string>("--app")
        {
            Description = "Application directory; defaults to the working directory.",
            Arity = ArgumentArity.ExactlyOne
        };

        var check = new Option<bool>("--check")
        {
            Description = "Validate plugins without starting their lifecycle."
        };

        command.Options.Add(app);
        command.Options.Add(check);
        command.SetAction(result => Run(result.GetValue(app) ?? Directory.GetCurrentDirectory(), result.GetValue(check)));
        return command;
    }

    private static int Run(string directory, bool check)
    {
        try
        {
            using var host = PluginHost.Open(directory);
            if (check)
            {
                Terminal.WriteLine("Plugin preflight succeeded; lifecycle not started");
                return 0;
            }

            using var done = new ManualResetEvent(false);
            ConsoleCancelEventHandler cancel = (_, args) => { args.Cancel = true; done.Set(); };
            Action<AssemblyLoadContext> unloading = _ => host.Dispose();
            Terminal.CancelKeyPress += cancel;
            AssemblyLoadContext.Default.Unloading += unloading;
            try
            {
                host.Start();
                Terminal.WriteLine("Service is available. Press Ctrl+C to exit.");
                done.WaitOne();
                host.Dispose();
                Environment.Exit(0);
                return 0;
            }
            finally
            {
                AssemblyLoadContext.Default.Unloading -= unloading;
                Terminal.CancelKeyPress -= cancel;
            }
        }
        catch (Exception ex)
        {
            Terminal.Error.WriteLine(ex);
            return 1;
        }
    }
}
