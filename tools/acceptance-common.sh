# Process and path handling shared by the two end-to-end scenarios.
windows=false
case $(uname -s) in MINGW*|MSYS*|CYGWIN*) windows=true ;; esac
fail() { echo "$*" >&2; exit 1; }
native_path() {
    if [[ $windows == true ]]; then cygpath -am "$1"; else realpath -m -- "$1"; fi
}
state_dir() {
    local generation
    generation=$(yq -p=json -o=yaml -e '.generation' "$1/.thinkinghome/current.json") || return 1
    printf '%s/.thinkinghome/states/%s\n' "$1" "$generation"
}

declare -A service_logs=()
start_service() {
    local log=$1; shift
    if [[ $windows == true ]]; then
        # Give the child its own hidden Windows console, so Ctrl+Break reaches only this service.
        local arg
        for arg in "$@"; do
            if [[ $arg == /* ]]; then arg=$(native_path "$arg"); fi
            printf '%s\0' "$arg"
        done > "$log.args"
        TH_SERVICE_LOG=$(native_path "$log") powershell.exe -NoProfile -NonInteractive -Command '
          $ErrorActionPreference = "Stop"
          $log = $env:TH_SERVICE_LOG
          $argv = [IO.File]::ReadAllText("$log.args").TrimEnd([char]0).Split([char]0)
          $arguments = ($argv[1..($argv.Length-1)] | ForEach-Object { [char]34 + $_ + [char]34 }) -join " "
          $p = Start-Process -FilePath $argv[0] -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput $log -RedirectStandardError "$log.err"
          [IO.File]::WriteAllText("$log.pid", [string]$p.Id)
          $p.WaitForExit()
          exit $p.ExitCode
        ' &
    else
        # Background jobs otherwise inherit an ignored SIGINT from non-interactive Bash.
        env --default-signal=INT "$@" > "$log" 2>&1 &
    fi
    service_pid=$!
    service_logs[$service_pid]=$log
}

stop_service() {
    local pid=$1 log=${service_logs[$1]}
    if [[ $windows == true ]]; then
        TH_TARGET=$(cat "$log.pid") powershell.exe -NoProfile -NonInteractive -Command '
          $ErrorActionPreference = "Stop"
          Add-Type -Name ConsoleSignal -Namespace TH -MemberDefinition @"
            [DllImport("kernel32.dll")] public static extern bool FreeConsole();
            [DllImport("kernel32.dll")] public static extern bool AttachConsole(uint pid);
            public delegate bool Handler(uint signal);
            public static readonly Handler IgnoreBreak = delegate { return true; };
            [DllImport("kernel32.dll")] public static extern bool SetConsoleCtrlHandler(Handler handler, bool add);
            [DllImport("kernel32.dll")] public static extern bool GenerateConsoleCtrlEvent(uint signal, uint group);
"@
          $null = [TH.ConsoleSignal]::FreeConsole()
          if (![TH.ConsoleSignal]::AttachConsole([uint32]$env:TH_TARGET)) { throw "Cannot attach to service console" }
          $null = [TH.ConsoleSignal]::SetConsoleCtrlHandler([TH.ConsoleSignal]::IgnoreBreak, $true)
          if (![TH.ConsoleSignal]::GenerateConsoleCtrlEvent(1, 0)) { throw "Cannot send Ctrl+Break" }
          Start-Sleep -Milliseconds 100
        '
    else
        kill -INT "$pid"
    fi
    local deadline=$((SECONDS + 30))
    while kill -0 "$pid" 2>/dev/null; do
        ((SECONDS < deadline)) || fail "Service did not stop: $log"
        sleep 0.1
    done
    wait "$pid" || fail "Service failed: $log"
    unset 'service_logs[$pid]'
}

cleanup_services() {
    local pid log target
    for pid in "${!service_logs[@]}"; do
        if ! kill -0 "$pid" 2>/dev/null; then wait "$pid" 2>/dev/null || :; continue; fi
        log=${service_logs[$pid]}
        if [[ $windows == true && -s $log.pid ]]; then
            target=$(cat "$log.pid")
            MSYS2_ARG_CONV_EXCL='*' taskkill.exe /pid "$target" /t /f >/dev/null 2>&1 || :
        fi
        kill -KILL "$pid" 2>/dev/null || :
        wait "$pid" 2>/dev/null || :
    done
}

wait_http() {
    local pid=$1 url=$2 deadline=$((SECONDS + 30))
    until curl --silent --fail --max-time 1 "$url"; do
        kill -0 "$pid" 2>/dev/null && ((SECONDS < deadline)) || fail "Service unavailable: $url (${service_logs[$pid]})"
        sleep 0.1
    done
}

for var in "${!THINKINGHOME_@}"; do unset "$var"; done
export DOTNET_NOLOGO=1
