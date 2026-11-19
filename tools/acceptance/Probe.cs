using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Runtime.InteropServices;
using Newtonsoft.Json;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.WebServer;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebServer.Handlers;

namespace Acceptance;
public sealed class ProbePlugin(TimerPlugin timer, WebServerPlugin server) : PluginBase
{
    [DllImport("e_sqlite3", CallingConvention = CallingConvention.Cdecl)] private static extern int sqlite3_libversion_number();
    [DllImport("kernel32.dll")] private static extern uint GetCurrentProcessId();
    [DllImport("libc")] private static extern int getpid();

    public override void StartPlugin()
    {
        if (timer.Context != Context || server.Context != Context) throw new Exception("DI identity mismatch");
    }

    [ConfigureWebServer]
    public void Configure(WebServerConfigurationBuilder builder)
    {
        builder.RegisterDynamicResource("/api/acceptance/state", State);
    }

    private HttpHandlerResult State(HttpRequestParams request)
    {
        var pid = OperatingSystem.IsWindows() ? (int)GetCurrentProcessId() : getpid();
        if (pid != Environment.ProcessId) throw new Exception("Native PID mismatch");

        var sqliteVersion = sqlite3_libversion_number();
        using var process = Process.GetCurrentProcess();
        var nativePath = process.Modules.Cast<ProcessModule>().Single(m =>
            Path.GetFileName(m.FileName) == (OperatingSystem.IsWindows() ? "e_sqlite3.dll" : "libe_sqlite3.so")).FileName;
        var nativeHash = Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(nativePath))).ToLowerInvariant();

        return HttpHandlerResult.Text(JsonConvert.SerializeObject(new {
            version = typeof(ProbePlugin).Assembly.GetName().Version.ToString(), pid, sqliteVersion, nativePath, nativeHash
        }));
    }
}
