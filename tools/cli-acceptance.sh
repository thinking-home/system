#!/usr/bin/env bash
set -euo pipefail
[[ $# == 2 ]] || { echo 'Usage: bash tools/cli-acceptance.sh CLI.nupkg TIMER.nupkg' >&2; exit 2; }
source "$(dirname "$0")/acceptance-common.sh"
cli=$(realpath -- "$1")
timer=$(realpath -- "$2")
work=$(mktemp -d)
server=
cleanup() {
    cleanup_services
    if [[ -n $server ]]; then kill "$server" 2>/dev/null || :; wait "$server" 2>/dev/null || :; fi
    rm -rf -- "$work"
}
trap cleanup EXIT
cd "$work"
cli_id=ThinkingHome.Console
plugin=ThinkingHome.Plugins.Timer

version_of() {
    unzip -p "$1" '*.nuspec' | ID=$2 yq -p=xml -e '.package.metadata | select(.id == strenv(ID)) | .version'
}
version=$(version_of "$cli" "$cli_id")
[[ $(version_of "$timer" "$plugin") == "$version" ]] || fail 'Expected matching CLI and Timer packages'
base=tools/net10.0/any
unzip -p "$cli" "$base/DotnetToolSettings.xml" | yq -p=xml --xml-attribute-prefix '@' -e \
    '.DotNetCliTool.Commands.Command | (.["@Name"] == "th" and .["@EntryPoint"] == "ThinkingHome.Console.dll")' >/dev/null
consumers=$(unzip -p "$cli" "$base/ThinkingHome.Console.deps.json" | yq -p=json \
    '.targets[.runtimeTarget.name] | to_entries[] | select(.key | test("^ThinkingHome\.")) |
     select(.value.dependencies | has("System.CommandLine")) | .key | split("/") | .[0]')
[[ $consumers == "$cli_id" ]] || fail "Unexpected System.CommandLine consumers: $consumers"
unzip -Z1 "$cli" > entries
if grep -Eiq '(^|/)(appsettings|plugins\.local)|\.exe$' entries; then fail 'Local configuration or executable in tool package'; fi

export DOTNET_CLI_HOME=$(native_path "$work/profile")
export NUGET_PACKAGES=$(native_path "$work/cache")
export NUGET_HTTP_CACHE_PATH=$(native_path "$work/http-cache")
export DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_ADD_GLOBAL_TOOLS_TO_PATH=0
mkdir tool-feed
cp "$cli" tool-feed/
cat > NuGet.Config <<'XML'
<configuration><packageSources><clear/><add key="local" value="./tool-feed"/></packageSources></configuration>
XML
timeout 90 dotnet tool install "$cli_id" --version "$version" --tool-path "$work/tools" --configfile NuGet.Config --no-cache
th="$work/tools/th"
if [[ $windows == true ]]; then th+=.exe; fi
installed=$("$th" --version | tr -d '\r')
[[ ${installed%%+*} == "$version" ]] || fail "Unexpected th version: $installed"
help=$("$th" --help)
[[ $help == *install* && $help == *uninstall* ]] || fail 'Missing package commands'

# Serve exactly the supplied Timer on a loopback-only NuGet V3 feed with an OS-assigned port.
node --input-type=module - "$timer" "$version" <<'JS' &
import http from 'node:http';
import { createReadStream, writeFileSync } from 'node:fs';
const [file, version] = process.argv.slice(2);
const id = 'thinkinghome.plugins.timer';
const server = http.createServer((req, res) => {
    const flat = '/flat/';
    if (req.url === '/index.json') {
        res.end(JSON.stringify({ version: '3.0.0', resources: [
            { '@id': origin + flat, '@type': 'PackageBaseAddress/3.0.0' }
        ] }));
    } else if (req.url === flat + id + '/index.json') {
        res.end(JSON.stringify({ versions: [version] }));
    } else if (req.url === flat + [id, version, id + '.' + version + '.nupkg'].join('/')) {
        createReadStream(file).pipe(res);
    } else { res.writeHead(404).end(); }
});
let origin;
server.listen(0, '127.0.0.1', () => {
    origin = 'http://127.0.0.1:' + server.address().port;
    writeFileSync('sources.json', JSON.stringify({ sources: [origin + '/index.json'] }));
});
JS
server=$!
deadline=$((SECONDS + 30))
until [[ -s sources.json ]]; do
    kill -0 "$server" && ((SECONDS < deadline)) || fail 'Local NuGet feed failed to start'
    sleep 0.1
done
timeout 90 "$th" install home "$plugin" "[$version]" sources.json
state=$(state_dir home)
digest=$(sha512sum < "$timer")
ID=$plugin VER=$version SHA=${digest%% *} yq -p=json -o=yaml -e '.packages | (length == 1 and
    .[0].id == strenv(ID) and .[0].version == strenv(VER) and .[0].kind == "plugin" and
    (.[0].sha512 | downcase) == strenv(SHA))' "$state/plugins.lock.json" >/dev/null
timeout 90 "$th" ci restored "$state/plugins.json" "$state" sources.json
kill "$server"; wait "$server" || :; server=
timeout 90 "$th" validate restored
(cd restored && timeout 90 "$th" run --check)
timeout 90 "$th" run --app restored --check
cd restored
start_service "$work/host.log" "$th" run
deadline=$((SECONDS + 30))
until grep -Fq 'Service is available.' "$work/host.log" 2>/dev/null; do
    kill -0 "$service_pid" 2>/dev/null && ((SECONDS < deadline)) || { cat "$work/host.log"* >&2; fail 'Host failed to start'; }
    sleep 0.1
done
stop_service "$service_pid"
cd "$work"
timeout 90 "$th" uninstall restored "$plugin"
timeout 90 "$th" validate restored
echo "PASS $cli_id + $plugin $version: isolated install, restore, run, shutdown and uninstall"
