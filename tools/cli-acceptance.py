"""Test the two release archives outside the checkout, without a public NuGet source."""
import argparse
import functools
import hashlib
import json
import os
from pathlib import Path
import shutil
import signal
import subprocess
import tempfile
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from xml.etree import ElementTree
from zipfile import ZipFile


def identity(path):
    with ZipFile(path) as archive:
        spec, = [name for name in archive.namelist() if name.endswith(".nuspec")]
        meta = ElementTree.fromstring(archive.read(spec)).find("{*}metadata")
        return meta.findtext("{*}id"), meta.findtext("{*}version")


def verify(work, cli, timer):
    cli_id, version = identity(cli)
    plugin, plugin_version = identity(timer)
    if (cli_id, plugin, plugin_version) != ("ThinkingHome.Console", "ThinkingHome.Plugins.Timer", version):
        raise ValueError("Expected matching CLI and Timer release packages")
    with ZipFile(cli) as archive:
        files = archive.namelist()
        settings = ElementTree.fromstring(archive.read("tools/net10.0/any/DotnetToolSettings.xml"))
        command, = settings.findall(".//Command")
        assert command.get("Name") == "th" and command.get("EntryPoint") == "ThinkingHome.Console.dll"
        deps = json.loads(archive.read("tools/net10.0/any/ThinkingHome.Console.deps.json"))
        graph = deps["targets"][deps["runtimeTarget"]["name"]]
        cli_parser_consumers = {key.split("/")[0] for key, value in graph.items()
                                if key.startswith("ThinkingHome.") and "System.CommandLine" in value.get("dependencies", {})}
        assert cli_parser_consumers == {cli_id}, cli_parser_consumers
        assert not any(Path(name).name.lower().startswith(("appsettings", "plugins.local")) or
                       name.lower().endswith(".exe") for name in files)

    feed = work / "tool-feed"
    feed.mkdir()
    shutil.copyfile(cli, feed / cli.name)
    env = {key: value for key, value in os.environ.items() if not key.startswith("THINKINGHOME_")}
    env.update(DOTNET_CLI_HOME=str(work / "profile"), NUGET_PACKAGES=str(work / "cache"),
               NUGET_HTTP_CACHE_PATH=str(work / "http-cache"), DOTNET_CLI_TELEMETRY_OPTOUT="1",
               DOTNET_NOLOGO="1", DOTNET_ADD_GLOBAL_TOOLS_TO_PATH="0")
    config = ElementTree.fromstring("<configuration><packageSources><clear/></packageSources></configuration>")
    ElementTree.SubElement(config.find("packageSources"), "add", key="local", value=str(feed))
    ElementTree.ElementTree(config).write(work / "NuGet.Config", encoding="utf-8")

    def run(*args, cwd=work):
        result = subprocess.run(args, cwd=cwd, env=env, check=True, timeout=90, text=True,
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        print(result.stdout.strip(), flush=True)
        return result.stdout

    tools = work / "tools"
    run("dotnet", "tool", "install", cli_id, "--version", version, "--tool-path", tools,
        "--configfile", work / "NuGet.Config", "--no-cache")
    executable = tools / ("th.exe" if os.name == "nt" else "th")
    assert run(executable, "--version").strip().split("+")[0] == version
    help_text = run(executable, "--help")
    assert "install" in help_text and "uninstall" in help_text

    repository = work / "http"
    flat = repository / "flat" / plugin.lower()
    (flat / version).mkdir(parents=True)
    (flat / "index.json").write_text(json.dumps({"versions": [version]}))
    shutil.copyfile(timer, flat / version / timer.name.lower())
    handler = functools.partial(SimpleHTTPRequestHandler, directory=str(repository))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server:
        address = f"http://127.0.0.1:{server.server_port}"
        (repository / "index.json").write_text(json.dumps({"version": "3.0.0", "resources": [
            {"@id": address + "/flat/", "@type": "PackageBaseAddress/3.0.0"}]}))
        sources = work / "sources.json"
        sources.write_text(json.dumps({"sources": [address + "/index.json"]}))
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            app = work / "home"
            run(executable, "install", app, plugin, f"[{version}]", sources)
            state, = (app / ".thinkinghome/states").iterdir()
            locked, = json.loads((state / "plugins.lock.json").read_bytes())["packages"]
            assert (locked["id"], locked["version"], locked["kind"]) == (plugin, version, "plugin")
            assert locked["sha512"].lower() == hashlib.sha512(timer.read_bytes()).hexdigest()
            restored = work / "restored"
            run(executable, "ci", restored, state / "plugins.json", state, sources)
        finally:
            server.shutdown()
    run(executable, "validate", restored)
    run(executable, "run", "--check", cwd=restored)
    run(executable, "run", "--app", restored, "--check")
    log = work / "host.log"
    with log.open("w") as output:
        flags = subprocess.CREATE_NEW_PROCESS_GROUP if os.name == "nt" else 0
        host = subprocess.Popen([executable, "run"], cwd=restored, env=env, stdout=output,
                                stderr=subprocess.STDOUT, creationflags=flags)
        try:
            deadline = time.monotonic() + 30
            while "Service is available." not in log.read_text(errors="replace"):
                if host.poll() is not None or time.monotonic() >= deadline:
                    raise RuntimeError(log.read_text(errors="replace"))
                time.sleep(0.1)
            host.send_signal(signal.CTRL_BREAK_EVENT if os.name == "nt" else signal.SIGINT)
            if host.wait(timeout=30) != 0:
                raise RuntimeError(log.read_text(errors="replace"))
        finally:
            if host.poll() is None:
                host.kill()
                host.wait()
    run(executable, "uninstall", restored, plugin)
    run(executable, "validate", restored)
    print(f"PASS {cli_id} + {plugin} {version}: isolated install, restore, run, shutdown and uninstall")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cli", type=Path)
    parser.add_argument("timer", type=Path)
    args = parser.parse_args()
    if not __debug__:
        parser.error("Run without -O to enable acceptance assertions")
    with tempfile.TemporaryDirectory(prefix="thinkinghome-cli-") as directory:
        verify(Path(directory), args.cli.resolve(), args.timer.resolve())
