using System;
using System.IO;
using ThinkingHome.PackageManagement;
using ThinkingHome.PackageRuntime;
using ThinkingHome.Platform;

namespace ThinkingHome.Core.Infrastructure;

public sealed class PluginHost : IDisposable
{
    private readonly HomeApplication application = new();
    private readonly PluginRuntime runtime;
    private readonly HomeConfiguration configuration;
    private bool started;
    private int disposed;

    private PluginHost(PluginRuntime runtime, HomeConfiguration configuration)
    {
        this.runtime = runtime;
        this.configuration = configuration;
    }

    public static PluginHost Open(string applicationDirectory)
    {
        var directory = Path.GetFullPath(applicationDirectory);
        var runtime = PluginRuntime.Open(directory, HostPlatform.Current());
        try
        {
            var configuration = new HomeConfiguration(directory, PackageManager.GeneratedConfiguration(runtime.Plan.Lock));
            return new PluginHost(runtime, configuration);
        }
        catch
        {
            runtime.Dispose();
            throw;
        }
    }

    public void Start()
    {
        ObjectDisposedException.ThrowIf(disposed != 0, this);
        if (started) throw new InvalidOperationException("Host already started");
        started = true;
        application.StartServices(configuration, runtime.PluginTypes);
    }

    public void Dispose()
    {
        if (System.Threading.Interlocked.Exchange(ref disposed, 1) != 0) return;
        try { if (started) application.StopServices(); }
        finally { runtime.Dispose(); }
    }
}
