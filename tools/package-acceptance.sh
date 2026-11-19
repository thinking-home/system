#!/usr/bin/env bash
set -euo pipefail
[[ $# == 1 ]] || { echo 'Usage: bash tools/package-acceptance.sh NEW_DIRECTORY' >&2; exit 2; }
root=$(cd "$(dirname "$0")/.." && pwd)
source "$root/tools/acceptance-common.sh"
work=$(realpath -m -- "$1")
mkdir -p -- "$(dirname "$work")"
mkdir -- "$work" || fail "Expected a new work directory: $work"
cd "$work"
trap cleanup_services EXIT
steps=()
run_step() {
    local label=$1 expected=$2 status=0; shift 2
    timeout 240 "$@" > "$label.log" 2>&1 || status=$?
    [[ $status == "$expected" ]] || { tail -n 15 "$label.log" >&2; fail "$label: exit $status, expected $expected"; }
    steps+=("$label"); echo "PASS $label"
}
unused_port() {
    node -e 'const s = require("node:net").createServer(); s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})' | tr -d '\r'
}

rid=linux-x64; native_name=libe_sqlite3.so; platform=posix
if [[ $windows == true ]]; then rid=win-x64; native_name=e_sqlite3.dll; platform=nt; fi
asset_path="runtimes/$rid/native/$native_name"
native_asset() {
    local app=$1 state key
    state=$(state_dir "$app")
    key=$(ASSET=$asset_path yq -p=json -o=yaml -e '.packages[] | select(.id | downcase == "sqlitepclraw.lib.e_sqlite3") |
        select(.files[] | .path == strenv(ASSET)) | .key' "$state/plugins.lock.json")
    printf '%s/.thinkinghome/packages/%s/files/%s\n' "$app" "$key" "$asset_path"
}
check_native() {
    local pid=$1 app=$2 version=$3 expected response actual hash
    response=$(wait_http "$pid" "$endpoint")
    expected=$(native_asset "$app")
    actual=$(yq -p=json -o=yaml -e '.nativePath' <<< "$response")
    if [[ $windows == true ]]; then actual=$(cygpath -u "$actual"); fi
    [[ $(realpath -- "$actual") == "$(realpath -- "$expected")" ]] || fail "Wrong native module: $actual"
    hash=$(sha256sum < "$expected")
    HASH=${hash%% *} VER=$version yq -p=json -o=yaml -e '.version == strenv(VER) and
        .sqliteVersion == 3053003 and .nativeHash == strenv(HASH)' <<< "$response" >/dev/null
    echo "$response" > "native-${app##*/}-$version.json"
}

mkdir packages probe
for item in Console:bundle Repository:repository Packaging:packer; do
    name=${item%:*}
    run_step "publish-$name" 0 dotnet publish "$root/ThinkingHome.$name/ThinkingHome.$name.csproj" \
        -c Release -o "$work/${item#*:}" -m:1 -p:UseSharedCompilation=false -p:NuGetAudit=false
done
[[ ! -e bundle/appsettings.Development.json && ! -e bundle/plugins.local.json ]] || fail 'Local settings leaked into published host'
packer=(dotnet "$work/packer/ThinkingHome.Packaging.dll" pack)
for name in Timer WebServer WebServer.UrlValidation; do
    run_step "pack-$name" 0 "${packer[@]}" "$root/ThinkingHome.Plugins.$name/ThinkingHome.Plugins.$name.csproj" "$work/packages"
done

cp "$root/tools/acceptance/Probe.cs" probe/
export TH_ACCEPTANCE_ROOT=$(native_path "$root")
cat > probe/Probe.csproj <<'XML'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <PackageId>Acceptance.Probe</PackageId>
    <Version>$(ProbeVersion)</Version>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="$(TH_ACCEPTANCE_ROOT)/ThinkingHome.Core.Plugins/ThinkingHome.Core.Plugins.csproj" />
    <ProjectReference Include="$(TH_ACCEPTANCE_ROOT)/ThinkingHome.Plugins.Timer/ThinkingHome.Plugins.Timer.csproj" />
    <ProjectReference Include="$(TH_ACCEPTANCE_ROOT)/ThinkingHome.Plugins.WebServer/ThinkingHome.Plugins.WebServer.csproj" />
    <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
    <PackageReference Include="SQLitePCLRaw.lib.e_sqlite3" Version="3.53.3" />
  </ItemGroup>
  <Import Project="$(TH_ACCEPTANCE_ROOT)/ThinkingHome.Packaging/build/ThinkingHome.Plugin.targets" />
</Project>
XML
for version in 1.0.0 2.0.0; do
    ProbeVersion=$version run_step "pack-probe-$version" 0 "${packer[@]}" "$work/probe/Probe.csproj" "$work/packages"
done

url="http://127.0.0.1:$(unused_port)"
start_service "$work/repository.log" dotnet "$work/repository/ThinkingHome.Repository.dll" "$work/packages" "$url"
server=$service_pid
wait_http "$server" "$url/v3/index.json" >/dev/null
printf '{"sources":["%s/v3/index.json","https://api.nuget.org/v3/index.json"]}\n' "$url" > sources.json
host=(dotnet "$work/bundle/ThinkingHome.Console.dll")
app="$work/application"; restored="$work/restored"
mkdir "$app"
web_port=$(unused_port)
endpoint="http://127.0.0.1:$web_port/api/acceptance/state"
printf '{"plugins":{"ThinkingHome.Plugins.WebServer.WebServerPlugin":{"port":%s}},"acceptance":"keep"}\n' "$web_port" > settings.json
cp settings.json "$app/appsettings.json"

run_step install 0 "${host[@]}" install "$app" Acceptance.Probe '[1.0.0]' sources.json
consumer=ThinkingHome.Plugins.WebServer.UrlValidation
archives=(packages/"$consumer".*.nupkg)
[[ ${#archives[@]} == 1 && -f ${archives[0]} ]] || fail 'Expected one UrlValidation package'
version=$(unzip -p "${archives[0]}" '*.nuspec' | yq -p=xml -e '.package.metadata.version')
run_step install-real-consumer 0 "${host[@]}" install "$app" "$consumer" "[$version]" sources.json
state=$(state_dir "$app")
yq -p=json -o=yaml -e '[.packages[] | select(.id | downcase == "newtonsoft.json")] | length == 1' "$state/plugins.lock.json" >/dev/null
run_step validate 0 "${host[@]}" validate "$app"
run_step preflight 0 "${host[@]}" run --app "$app" --check
start_service "$work/host-v1.log" "${host[@]}" run --app "$app"
running=$service_pid
check_native "$running" "$app" 1.0.0.0

cp "$app/.thinkinghome/current.json" original-pointer.json
run_step reject-required-remove 1 "${host[@]}" uninstall "$app" ThinkingHome.Plugins.WebServer
grep -Fq 'required by' reject-required-remove.log
run_step reject-missing-version 1 "${host[@]}" install "$app" Acceptance.Probe '[9.0.0]' sources.json
cmp original-pointer.json "$app/.thinkinghome/current.json"
run_step update-while-running 0 "${host[@]}" install "$app" Acceptance.Probe '[2.0.0]' sources.json
check_native "$running" "$app" 1.0.0.0
stop_service "$running"
start_service "$work/host-v2.log" "${host[@]}" run --app "$app"
check_native "$service_pid" "$app" 2.0.0.0
stop_service "$service_pid"
steps+=(restart-applies-update-and-native-call)

state=$(state_dir "$app")
run_step ci-clean 0 "${host[@]}" ci "$restored" "$state/plugins.json" "$state" sources.json
copy_state=$(state_dir "$restored")
for name in plugins.json plugins.lock.json load-map.json; do cmp "$state/$name" "$copy_state/$name"; done
run_step restored-preflight 0 "${host[@]}" run --app "$restored" --check
cp settings.json "$restored/appsettings.json"
start_service "$work/host-restored.log" "${host[@]}" run --app "$restored"
check_native "$service_pid" "$restored" 2.0.0.0
stop_service "$service_pid"
steps+=(native-loaded-after-ci)

stop_service "$server"
run_step validate-offline 0 "${host[@]}" validate "$restored"
restore=(ci "$restored" "$state/plugins.json" "$state" sources.json)
run_step ci-cached-offline 0 "${host[@]}" "${restore[@]}"
lock="$(state_dir "$restored")/plugins.lock.json"
dll=$(yq -p=json -o=yaml -e '.packages[] | select(.id | downcase == "acceptance.probe") |
    .key + "/files/" + (.files[] | select(.path | test("/Probe\.dll$")) | .path)' "$lock")
printf 'damaged' > "$restored/.thinkinghome/packages/$dll"
run_step detect-corruption 1 "${host[@]}" validate "$restored"
run_step repair-offline 0 "${host[@]}" "${restore[@]}"
run_step validate-repaired 0 "${host[@]}" validate "$restored"
printf 'damaged native' > "$(native_asset "$restored")"
run_step detect-native-corruption 1 "${host[@]}" validate "$restored"
run_step repair-native-offline 0 "${host[@]}" "${restore[@]}"
start_service "$work/host-native-repaired.log" "${host[@]}" run --app "$restored"
check_native "$service_pid" "$restored" 2.0.0.0
stop_service "$service_pid"
steps+=(native-loaded-after-repair)
run_step recover 0 "${host[@]}" recover "$restored"

run_step remove-probe 0 "${host[@]}" uninstall "$app" Acceptance.Probe
yq -p=json -o=yaml -e '[.packages[] | .id | downcase |
    select(. == "newtonsoft.json" or . == "thinkinghome.plugins.timer" or . == "sqlitepclraw.lib.e_sqlite3")] |
    length == 0' "$(state_dir "$app")/plugins.lock.json" >/dev/null
run_step remove-last-root 0 "${host[@]}" uninstall "$app" "$consumer"
yq -p=json -o=yaml -e '.packages | length == 0' "$(state_dir "$app")/plugins.lock.json" >/dev/null
run_step validate-empty 0 "${host[@]}" validate "$app"
run_step preflight-empty 0 "${host[@]}" run --app "$app" --check
cmp settings.json "$app/appsettings.json"
PLATFORM=$platform STEPS=$(printf '%s\n' "${steps[@]}") yq -n -o=json \
    '{"status":"passed","platform":strenv(PLATFORM),"steps":(strenv(STEPS) | split("\n"))}' > result.json
echo "Acceptance passed: $work"
