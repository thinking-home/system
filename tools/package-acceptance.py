"""Run the published package-manager lifecycle in a fresh directory (Python 3, .NET 10 SDK)."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import signal
import socket
import subprocess
import time
import urllib.error
import urllib.request
from xml.sax.saxutils import escape


ROOT = Path(__file__).resolve().parents[1]


def port():
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2), encoding="utf-8")


class Acceptance:
    def __init__(self, work):
        self.work = work.resolve()
        self.work.mkdir(parents=True, exist_ok=False)
        self.steps = []
        self.children = []
        self.env = {k: v for k, v in os.environ.items() if not k.startswith("THINKINGHOME_")}
        self.env["DOTNET_NOLOGO"] = "1"

    def run(self, label, *args, expected=0):
        result = subprocess.run([str(x) for x in args], cwd=self.work, env=self.env,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=240)
        (self.work / (label + ".log")).write_bytes(result.stdout)
        if result.returncode != expected:
            raise RuntimeError(f"{label}: exit {result.returncode}, expected {expected}; see {label}.log")
        self.steps.append(label)
        print("PASS " + label, flush=True)
        return result.stdout.decode("utf-8", errors="replace")

    def start(self, label, *args):
        log = (self.work / (label + ".log")).open("wb")
        options = {"creationflags": subprocess.CREATE_NEW_PROCESS_GROUP} if os.name == "nt" else {}
        process = subprocess.Popen([str(x) for x in args], cwd=self.work, env=self.env,
                                   stdout=log, stderr=subprocess.STDOUT, **options)
        self.children.append((process, log))
        return process

    def stop(self, process):
        if process.poll() is None:
            process.send_signal(signal.CTRL_BREAK_EVENT if os.name == "nt" else signal.SIGINT)
            process.wait(timeout=30)
        if process.returncode != 0:
            raise RuntimeError(f"Process {process.pid} stopped with {process.returncode}")

    def wait_http(self, process, url):
        deadline = time.monotonic() + 30
        while time.monotonic() < deadline:
            if process.poll() is not None:
                raise RuntimeError(f"Process {process.pid} exited before HTTP was ready")
            try:
                with urllib.request.urlopen(url, timeout=1) as response:
                    return response.read().decode()
            except (urllib.error.URLError, TimeoutError):
                time.sleep(0.1)
        raise TimeoutError(url)

    def state(self, app):
        pointer = json.loads((app / ".thinkinghome/current.json").read_text())
        return app / ".thinkinghome/states" / pointer["generation"]

    def check_native(self, process, endpoint, app):
        response = json.loads(self.wait_http(process, endpoint))
        state = self.state(app)
        locked = json.loads((state / "plugins.lock.json").read_text())
        package = next(p for p in locked["packages"] if p["id"].lower() == "sqlitepclraw.lib.e_sqlite3")

        # The actual loaded module must come from this installation, not the OS or SDK.
        name = "e_sqlite3.dll" if os.name == "nt" else "libe_sqlite3.so"
        rid = "win-x64" if os.name == "nt" else "linux-x64"
        asset = next(f for f in package["files"] if f["path"] == f"runtimes/{rid}/native/{name}")
        expected = app / ".thinkinghome/packages" / package["key"] / "files" / asset["path"]

        assert Path(response["nativePath"]).resolve() == expected.resolve(), response
        assert response["sqliteVersion"] == 3053003, response
        assert response["nativeHash"] == hashlib.sha256(expected.read_bytes()).hexdigest(), response
        write_json(self.work / ("native-" + app.name + "-" + response["version"] + ".json"), response)
        return response

    def execute(self):
        bundle, repository, packer = [self.work / x for x in ("bundle", "repository", "packer")]
        packages = self.work / "packages"
        packages.mkdir()
        for name, output in (("Console", bundle), ("Repository", repository), ("Packaging", packer)):
            self.run("publish-" + name, "dotnet", "publish", ROOT / f"ThinkingHome.{name}/ThinkingHome.{name}.csproj",
                     "-c", "Release", "-o", output, "-m:1", "-p:UseSharedCompilation=false", "-p:NuGetAudit=false")
        assert not (bundle / "appsettings.Development.json").exists(), "Development settings leaked into publication"
        assert not (bundle / "plugins.local.json").exists(), "Local connections leaked into publication"

        for name in ("Timer", "WebServer", "WebServer.UrlValidation"):
            self.run("pack-" + name, "dotnet", packer / "ThinkingHome.Packaging.dll", "pack",
                     ROOT / f"ThinkingHome.Plugins.{name}/ThinkingHome.Plugins.{name}.csproj", packages)

        # Exercise typed plugin references, a managed NuGet library and a native NuGet library.
        project = self.work / "probe"
        project.mkdir()
        references = "".join(f'<ProjectReference Include="{escape(str(ROOT / path))}" />' for path in (
            "ThinkingHome.Core.Plugins/ThinkingHome.Core.Plugins.csproj",
            "ThinkingHome.Plugins.Timer/ThinkingHome.Plugins.Timer.csproj",
            "ThinkingHome.Plugins.WebServer/ThinkingHome.Plugins.WebServer.csproj"))
        (project / "Probe.cs").write_text(PROBE, encoding="utf-8")
        for version in ("1.0.0", "2.0.0"):
            (project / "Probe.csproj").write_text(f'''<Project Sdk="Microsoft.NET.Sdk">
<PropertyGroup><TargetFramework>net10.0</TargetFramework><PackageId>Acceptance.Probe</PackageId><Version>{version}</Version></PropertyGroup>
<ItemGroup>{references}<PackageReference Include="Newtonsoft.Json" Version="13.0.3" /><PackageReference Include="SQLitePCLRaw.lib.e_sqlite3" Version="3.53.3" /></ItemGroup>
<Import Project="{escape(str(ROOT / 'ThinkingHome.Packaging/build/ThinkingHome.Plugin.targets'))}" />
</Project>''', encoding="utf-8")
            self.run("pack-probe-" + version, "dotnet", packer / "ThinkingHome.Packaging.dll", "pack", project / "Probe.csproj", packages)

        url = f"http://127.0.0.1:{port()}"
        server = self.start("repository", "dotnet", repository / "ThinkingHome.Repository.dll", packages, url)
        self.wait_http(server, url + "/v3/index.json")
        sources = self.work / "sources.json"
        write_json(sources, {"sources": [url + "/v3/index.json", "https://api.nuget.org/v3/index.json"]})
        host = bundle / "ThinkingHome.Console.dll"
        app, copy = self.work / "application", self.work / "restored"
        app.mkdir()
        web_port = port()
        settings = {"plugins": {"ThinkingHome.Plugins.WebServer.WebServerPlugin": {"port": web_port}}, "acceptance": "keep"}
        write_json(app / "appsettings.json", settings)
        original_settings = (app / "appsettings.json").read_bytes()

        self.run("install", "dotnet", host, "install", app, "Acceptance.Probe", "[1.0.0]", sources)
        consumer_id = "ThinkingHome.Plugins.WebServer.UrlValidation"
        consumer_package, = packages.glob(f"{consumer_id}.*.nupkg")
        consumer_version = consumer_package.stem.removeprefix(consumer_id + ".")
        self.run("install-real-consumer", "dotnet", host, "install", app, consumer_id, f"[{consumer_version}]", sources)
        state = self.state(app)
        locked = json.loads((state / "plugins.lock.json").read_text())
        assert len([p for p in locked["packages"] if p["id"].lower() == "newtonsoft.json"]) == 1
        self.run("validate", "dotnet", host, "validate", app)
        self.run("preflight", "dotnet", host, "run", "--app", app, "--check")
        endpoint = f"http://127.0.0.1:{web_port}/api/acceptance/state"
        running = self.start("host-v1", "dotnet", host, "run", "--app", app)
        assert self.check_native(running, endpoint, app)["version"] == "1.0.0.0"

        pointer = (app / ".thinkinghome/current.json").read_bytes()
        output = self.run("reject-required-remove", "dotnet", host, "uninstall", app, "ThinkingHome.Plugins.WebServer", expected=1)
        assert "required by" in output
        self.run("reject-missing-version", "dotnet", host, "install", app, "Acceptance.Probe", "[9.0.0]", sources, expected=1)
        assert pointer == (app / ".thinkinghome/current.json").read_bytes()

        self.run("update-while-running", "dotnet", host, "install", app, "Acceptance.Probe", "[2.0.0]", sources)
        assert self.check_native(running, endpoint, app)["version"] == "1.0.0.0"
        self.stop(running)
        running = self.start("host-v2", "dotnet", host, "run", "--app", app)
        assert self.check_native(running, endpoint, app)["version"] == "2.0.0.0"
        self.stop(running)
        self.steps.append("restart-applies-update-and-native-call")

        state = self.state(app)
        self.run("ci-clean", "dotnet", host, "ci", copy, state / "plugins.json", state, sources)
        for name in ("plugins.json", "plugins.lock.json", "load-map.json"):
            assert (state / name).read_bytes() == (self.state(copy) / name).read_bytes()
        self.run("restored-preflight", "dotnet", host, "run", "--app", copy, "--check")
        write_json(copy / "appsettings.json", settings)
        restored = self.start("host-restored", "dotnet", host, "run", "--app", copy)
        assert self.check_native(restored, endpoint, copy)["version"] == "2.0.0.0"
        self.stop(restored)
        self.steps.append("native-loaded-after-ci")

        self.stop(server)
        self.run("validate-offline", "dotnet", host, "validate", copy)
        self.run("ci-cached-offline", "dotnet", host, "ci", copy, state / "plugins.json", state, sources)
        locked = json.loads((self.state(copy) / "plugins.lock.json").read_text())
        probe = next(p for p in locked["packages"] if p["id"].lower() == "acceptance.probe")
        dll = next(f["path"] for f in probe["files"] if f["path"].endswith("/Probe.dll"))
        damaged = copy / ".thinkinghome/packages" / probe["key"] / "files" / dll
        damaged.write_bytes(b"damaged")
        self.run("detect-corruption", "dotnet", host, "validate", copy, expected=1)
        self.run("repair-offline", "dotnet", host, "ci", copy, state / "plugins.json", state, sources)
        self.run("validate-repaired", "dotnet", host, "validate", copy)

        # Corrupt the selected native binary only after all host processes have stopped.
        native_package = next(p for p in locked["packages"] if p["id"].lower() == "sqlitepclraw.lib.e_sqlite3")
        native_rid = "win-x64" if os.name == "nt" else "linux-x64"
        native_name = "e_sqlite3.dll" if os.name == "nt" else "libe_sqlite3.so"
        native_file = next(f["path"] for f in native_package["files"]
                           if f["path"] == f"runtimes/{native_rid}/native/{native_name}")
        (copy / ".thinkinghome/packages" / native_package["key"] / "files" / native_file).write_bytes(b"damaged native")
        self.run("detect-native-corruption", "dotnet", host, "validate", copy, expected=1)
        self.run("repair-native-offline", "dotnet", host, "ci", copy, state / "plugins.json", state, sources)

        repaired = self.start("host-native-repaired", "dotnet", host, "run", "--app", copy)
        assert self.check_native(repaired, endpoint, copy)["version"] == "2.0.0.0"
        self.stop(repaired)
        self.steps.append("native-loaded-after-repair")
        self.run("recover", "dotnet", host, "recover", copy)

        self.run("remove-probe", "dotnet", host, "uninstall", app, "Acceptance.Probe")
        remaining = json.loads((self.state(app) / "plugins.lock.json").read_text())
        assert all(p["id"].lower() not in ("newtonsoft.json", "thinkinghome.plugins.timer", "sqlitepclraw.lib.e_sqlite3") for p in remaining["packages"])
        self.run("remove-last-root", "dotnet", host, "uninstall", app, "ThinkingHome.Plugins.WebServer.UrlValidation")
        assert not json.loads((self.state(app) / "plugins.lock.json").read_text())["packages"]
        self.run("validate-empty", "dotnet", host, "validate", app)
        self.run("preflight-empty", "dotnet", host, "run", "--app", app, "--check")
        assert (app / "appsettings.json").read_bytes() == original_settings

    def close(self):
        for process, log in reversed(self.children):
            try:
                if process.poll() is None:
                    self.stop(process)
            except (OSError, subprocess.TimeoutExpired, RuntimeError):
                if process.poll() is None:
                    process.kill()
                    process.wait()
            finally:
                log.close()


PROBE = '''using System;
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
'''


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("work", type=Path, help="New output directory; must not exist")
    args = parser.parse_args()
    check = Acceptance(args.work)
    try:
        check.execute()
        write_json(check.work / "result.json", {"status": "passed", "platform": os.name, "steps": check.steps})
        print("Acceptance passed: " + str(check.work), flush=True)
    finally:
        check.close()
