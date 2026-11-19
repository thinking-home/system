#!/usr/bin/env bash
set -euo pipefail
set +x
export DOTNET_NOLOGO=1
nuget_key=${NUGET_API_KEY:-}
export -n nuget_key
unset NUGET_API_KEY
source_url=https://api.nuget.org/v3/index.json
root=$(cd "$(dirname "$0")/.." && pwd)
usage='Usage: bash tools/publish-nuget.sh {build|push|publish} [--output DIR] [--resume]'
die() { echo "$*" >&2; exit 1; }

action=${1:-}
case "$action" in
    -h|--help) echo "$usage"; exit 0 ;;
    build|push|publish) shift ;;
    *) die "$usage" ;;
esac
output= resume=()
while (($#)); do
    case "$1" in
        --output) [[ -n ${2:-} ]] || die "$usage"; output=$(realpath -m -- "$2"); shift 2 ;;
        --resume) [[ $action == push ]] || die '--resume requires push'; resume=(--skip-duplicate); shift ;;
        *) die "$usage" ;;
    esac
done
[[ $action == build || -n ${nuget_key//[[:space:]]/} ]] || die 'Set NUGET_API_KEY to publish'
cd "$root"
version=$(yq -p=xml -e '.Project.PropertyGroup | .VersionPrefix + (("-" + .VersionSuffix) | sub("^-$",""))' Package.xml)
[[ $version =~ ^[0-9][0-9A-Za-z.+-]*$ ]] || die 'Invalid version in Package.xml'
output=${output:-$root/artifacts/nuget-release/$version}

work=$(mktemp -d)
stage=
cleanup() { rm -rf -- "$work"; if [[ -n $stage ]]; then rm -rf -- "$stage"; fi; }
trap cleanup EXIT
dotnet sln ThinkingHome.sln list > "$work/solution"
declare -a ids=()
declare -A project=() plugin=() description=() canonical=()
while IFS= read -r path; do
    path=${path%$'\r'}
    [[ $path == *.csproj ]] || continue
    path=${path//\\//}
    props=$(dotnet msbuild "$path" -p:Configuration=Release \
        -getProperty:IsPackable,PackageId,PackageVersion,IsThinkingHomePlugin,Description |
        yq -p=json -o=json -I=0 '.Properties | select(.IsPackable | downcase == "true")')
    [[ -n $props ]] || continue
    id=$(yq -p=json -r '.PackageId' <<< "$props")
    [[ $id =~ ^[a-zA-Z0-9_.-]+$ && -z ${canonical[${id,,}]:-} ]] || die "Invalid or duplicate package ID: $id"
    [[ $(yq -p=json -r '.PackageVersion' <<< "$props") == "$version" ]] || die "$path differs from Package.xml"
    ids+=("$id"); canonical[${id,,}]=$id
    project[$id]=$path
    plugin[$id]=$(yq -p=json -r '.IsThinkingHomePlugin | downcase' <<< "$props")
    description[$id]=$(yq -p=json -r '.Description' <<< "$props")
done < "$work/solution"
((${#ids[@]})) || die 'No packable projects found'

inspect_release() {
    local dir=$1 id file spec meta readme dependency hash comma=''
    local -a packages
    shopt -s nullglob
    packages=("$dir"/*.nupkg)
    ((${#packages[@]} == ${#ids[@]})) || die "Unexpected package count in $dir"
    : > "$work/edges"
    echo '{' > "$work/manifest"
    for id in "${ids[@]}"; do
        file="$dir/$id.$version.nupkg"
        [[ -f $file ]] || die "Missing $file"
        spec=$(unzip -Z1 "$file" | grep -E '^[^/]+\.nuspec$') || die "Missing nuspec: $file"
        [[ -n $spec && $spec != *$'\n'* ]] || die "Expected one nuspec in $file"
        meta=$(unzip -p "$file" "$spec" | yq -p=xml -o=json -I=0 --xml-attribute-prefix '@' \
            --xml-content-name '#text' '.package.metadata')
        PKG_ID=$id PKG_VERSION=$version PKG_DESC=${description[$id]} yq -p=json -e '
          .id == strenv(PKG_ID) and .version == strenv(PKG_VERSION) and
          .description == strenv(PKG_DESC) and (.description | length) > 0 and
          .description != "Package Description" and .description != .id and
          (.authors | length) > 0 and (.tags | length) > 0 and (.projectUrl | length) > 0 and
          .license."#text" == "MIT" and (.repository."@url" | length) > 0 and (.readme | length) > 0
        ' <<< "$meta" >/dev/null || die "Invalid package metadata: $file"
        readme=$(yq -p=json '.readme' <<< "$meta")
        unzip -p "$file" "$readme" > "$work/readme"
        grep -q '[^[:space:]]' "$work/readme" || die "Empty readme: $file"
        printf '%s %s\n' "$id" "$id" >> "$work/edges"
        yq -p=json '.dependencies | .. | select(kind == "map" and has("@id")) | .["@id"]' \
            <<< "$meta" > "$work/dependencies"
        while IFS= read -r dependency; do
            [[ -n $dependency ]] || continue
            dependency=${canonical[${dependency,,}]:-}
            [[ $dependency != "$id" ]] || die "Package depends on itself: $id"
            if [[ -n $dependency ]]; then printf '%s %s\n' "$dependency" "$id" >> "$work/edges"; fi
        done < "$work/dependencies"
        hash=$(sha256sum < "$file")
        printf '%s  "%s": "%s"' "$comma" "${file##*/}" "${hash%% *}" >> "$work/manifest"
        comma=$',\n'
    done
    printf '\n}\n' >> "$work/manifest"
    tsort "$work/edges" > "$work/order"
}

if [[ $action != push ]]; then
    mkdir -p -- "$(dirname "$output")"
    [[ ! -e $output || ( -d $output && -z $(ls -A -- "$output") ) ]] || die "Build output must be empty: $output"
    stage=$(mktemp -d "$(dirname "$output")/.nuget-build-XXXXXX")
    packer=ThinkingHome.Packaging/ThinkingHome.Packaging.csproj
    flags=(-c Release -m:1 -p:UseSharedCompilation=false -p:NuGetAudit=false)
    dotnet build "$packer" "${flags[@]}"
    for id in "${ids[@]}"; do
        path=${project[$id]}
        echo "Packing $id $version"
        # Generate web assets before pack evaluates EmbeddedResource on a clean checkout.
        if [[ -f ${path%/*}/package.json ]]; then dotnet build "$path" "${flags[@]}"; fi
        if [[ ${plugin[$id]} == true ]]; then
            dotnet run --no-build -c Release --project "$packer" -- pack "$path" "$stage"
        else
            dotnet pack "$path" "${flags[@]}" -o "$stage"
        fi
    done
    inspect_release "$stage"
    cp "$work/manifest" "$stage/release.json"
    if [[ -d $output ]]; then rmdir -- "$output"; fi
    mv -T -- "$stage" "$output"
    stage=
    echo "Verified ${#ids[@]} packages in $output"
fi

if [[ $action != build ]]; then
    inspect_release "$output"
    yq -p=json -o=json -I=0 'sort_keys(.)' "$output/release.json" > "$work/expected"
    yq -p=json -o=json -I=0 'sort_keys(.)' "$work/manifest" > "$work/actual"
    cmp -s "$work/expected" "$work/actual" || die 'Release files differ from the verified build'
    while IFS= read -r id; do
        dotnet nuget push "$output/$id.$version.nupkg" --source "$source_url" --api-key "$nuget_key" \
            --no-symbols --force-english-output "${resume[@]}"
    done < "$work/order"
fi
