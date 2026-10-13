using System.Runtime.CompilerServices;
using System.Text.Json;
using NuGet.Versioning;
using ThinkingHome.PackagePlanning;
using ThinkingHome.PackageSources;

[assembly: InternalsVisibleTo("ThinkingHome.Packaging.Tests")]

namespace ThinkingHome.PackageManagement;

public sealed class PackageManager {
    private readonly string root;
    private readonly PlatformCatalog platform;
    private readonly ILockedPackageSource? source;
    internal Action<string>? Checkpoint { get; init; }
    private string PathIn(string path) => Storage.Within(root, path);
    private string Store => PathIn("packages");

    public PackageManager(string applicationDirectory, PlatformCatalog platform, ILockedPackageSource? source = null) {
        this.root = Storage.Within(Path.GetFullPath(applicationDirectory), ".thinkinghome");
        this.platform = platform;
        this.source = source;
    }

    public async Task<InstalledState> InstallAsync(string id, string version, CancellationToken cancellation = default) {
        using var operation = BeginOperation();
        RecoverCore();
        var previous = ReadCurrent();
        var request = previous?.Request ?? new PlanRequest(platform.Framework, platform.Rid, []);
        if (request.Framework != platform.Framework || request.Rid != platform.Rid) throw new InvalidDataException("Installation target differs from platform");
        var roots = request.Plugins.Where(x => !string.Equals(x.Id, id, StringComparison.OrdinalIgnoreCase)).Append(new RootPlugin(id, version)).ToArray();
        request = request with { Plugins = roots };
        var captured = new CapturingSource(source ?? throw new InvalidOperationException("Package source is required for install"));
        var plan = await new PackagePlanner(captured).PlanAsync(request, platform, cancellation);
        return await Apply(request, plan, captured.Archives, previous, cancellation);
    }

    public async Task<InstalledState> RestoreLockedAsync(PlanRequest request, InstallationPlan plan, CancellationToken cancellation = default) {
        using var operation = BeginOperation();
        RecoverCore();
        LockedPlanVerifier.CheckEnvelope(request, plan, platform);
        return await Apply(request, plan, new Dictionary<string, byte[]>(StringComparer.Ordinal), ReadCurrent(), cancellation);
    }

    public InstallationSnapshot OpenSnapshot() {
        if (!File.Exists(PathIn("current.json"))) throw new InvalidDataException("No installed state");
        var lease = UseLease(exclusive: false);
        try {
            if (File.Exists(PathIn("transaction.json"))) throw new IOException("Installation transaction is pending; retry or run recover");
            return new(lease, ReadCurrent() ?? throw new InvalidDataException("No installed state"), Store);
        } catch { lease.Dispose(); throw; }
    }

    public InstalledState Validate(CancellationToken cancellation = default) {
        using var snapshot = OpenSnapshot();
        var state = snapshot.State;
        var archives = new Dictionary<string, byte[]>(StringComparer.Ordinal);
        foreach (var package in state.Plan.Lock.Packages) {
            cancellation.ThrowIfCancellationRequested();
            archives.Add(package.Key, PackageStore.Verify(Storage.Within(Store, package.Key), package));
        }
        LockedPlanVerifier.Verify(state.Request, state.Plan, platform, archives, cancellation);
        return state;
    }

    public void Recover() { using var operation = BeginOperation(); RecoverCore(); }

    private async Task<InstalledState> Apply(PlanRequest request, InstallationPlan plan, Dictionary<string, byte[]> available,
        InstalledState? previous, CancellationToken cancellation) {
        LockedPlanVerifier.CheckEnvelope(request, plan, platform);
        var generation = Guid.NewGuid().ToString("N");
        var staging = PathIn("staging/" + generation);
        Directory.CreateDirectory(staging);
        var archives = new Dictionary<string, byte[]>(StringComparer.Ordinal);
        var changes = new List<LockedPackage>();
        var repairs = new List<string>();
        FileStream? exclusiveUse = null;
        var committed = false;
        var mayClean = true;
        try {
            foreach (var package in plan.Lock.Packages) {
                cancellation.ThrowIfCancellationRequested();
                var oldPackage = previous?.Plan.Lock.Packages.SingleOrDefault(x => x.Key == package.Key);
                if (oldPackage != null && oldPackage.Sha512 != package.Sha512)
                    throw new InvalidDataException("Immutable package identity changed: " + package.Key);
                var directory = Storage.Within(Store, package.Key);
                if (Directory.Exists(directory)) {
                    // Запрещаем замену опубликованной identity независимо от наличия работающих потребителей.
                    CheckImmutableIdentity(directory, package, previous);
                    try { archives.Add(package.Key, PackageStore.Verify(directory, package)); continue; }
                    catch (Exception ex) when (ex is IOException or InvalidDataException or JsonException) { repairs.Add(package.Key); }
                }
                if (!available.TryGetValue(package.Key, out var bytes)) {
                    // Повреждённая распаковка может восстанавливаться без сети из целого локального архива.
                    var archivePath = Storage.Within(directory, "package.nupkg");
                    if (File.Exists(archivePath) && new FileInfo(archivePath).Length <= 64 * 1024 * 1024) {
                        var local = File.ReadAllBytes(archivePath);
                        if (PlanJson.Hash(local) == package.Sha512) bytes = local;
                    }
                    if (bytes == null) {
                        var download = await (source ?? throw new IOException("Missing package and no source configured: " + package.Key))
                            .DownloadLockedAsync(new Uri(package.Source), package.Kind == "plugin" ? PackageKind.Plugin : PackageKind.Library,
                                package.Id, NuGetVersion.Parse(package.Version), cancellation);
                        if (download.Source.AbsoluteUri != package.Source) throw new InvalidDataException("Locked source changed: " + package.Key);
                        bytes = download.Bytes;
                    }
                }
                PackageStore.CheckArchive(package, bytes);
                archives.Add(package.Key, bytes);
                PackageStore.Extract(Storage.Within(staging, "packages/" + package.Key), package, bytes);
                changes.Add(package);
            }
            LockedPlanVerifier.Verify(request, plan, platform, archives, cancellation);
            request = new(plan.Lock.Framework, plan.Lock.Rid, plan.Lock.Roots);
            var stateDirectory = Storage.Within(staging, "state");
            var requestBytes = PlanJson.Bytes(request);
            var lockBytes = PlanJson.Bytes(plan.Lock);
            var mapBytes = PlanJson.Bytes(plan.LoadMap);
            Storage.Write(Storage.Within(stateDirectory, "plugins.json"), requestBytes);
            Storage.Write(Storage.Within(stateDirectory, "plugins.lock.json"), lockBytes);
            Storage.Write(Storage.Within(stateDirectory, "load-map.json"), mapBytes);
            var pointer = new StatePointer(1, generation, PlanJson.Hash(requestBytes), PlanJson.Hash(lockBytes), PlanJson.Hash(mapBytes));
            var result = new InstalledState(generation, PathIn("states/" + generation), request, plan);
            Checkpoint?.Invoke("staged");
            cancellation.ThrowIfCancellationRequested();
            if (repairs.Count > 0) exclusiveUse = UseLease(exclusive: true);
            Storage.Replace(PathIn("transaction.json"), PlanJson.Bytes(new TransactionJournal(1, generation, previous?.Generation, repairs.ToArray())));
            mayClean = false;
            foreach (var package in changes) {
                cancellation.ThrowIfCancellationRequested();
                var destination = Storage.Within(Store, package.Key);
                if (repairs.Contains(package.Key)) {
                    var backup = Storage.Within(staging, "backups/" + package.Key);
                    Directory.CreateDirectory(Path.GetDirectoryName(backup)!);
                    Directory.Move(destination, backup);
                    Checkpoint?.Invoke("repair-backed-up");
                }
                Directory.CreateDirectory(Path.GetDirectoryName(destination)!);
                Directory.Move(Storage.Within(staging, "packages/" + package.Key), destination);
                Checkpoint?.Invoke("package-published");
            }
            Directory.CreateDirectory(PathIn("states"));
            Directory.Move(stateDirectory, result.Directory);
            Checkpoint?.Invoke("state-published");
            cancellation.ThrowIfCancellationRequested();
            Storage.Replace(PathIn("current.json"), PlanJson.Bytes(pointer));
            committed = true;
            mayClean = true;
            return result;
        } catch {
            // При ошибке до указателя откатываем только заменённые повреждённые каталоги. Новые пакеты остаются неактивным кешем.
            if (File.Exists(PathIn("transaction.json"))) RollbackRepairs(Storage.Read<TransactionJournal>(PathIn("transaction.json")));
            mayClean = true;
            throw;
        } finally {
            // Не маскируем успешный commit ошибкой удаления временных файлов: journal будет обработан следующей операцией.
            try {
                if (mayClean) {
                    Storage.DeleteOwnedDirectory(staging);
                    if (File.Exists(PathIn("transaction.json"))) File.Delete(PathIn("transaction.json"));
                }
            } catch (Exception ex) when (committed && ex is IOException or UnauthorizedAccessException) { }
            finally { exclusiveUse?.Dispose(); }
        }
    }

    private void CheckImmutableIdentity(string directory, LockedPackage package, InstalledState? previous) {
        var locked = previous?.Plan.Lock.Packages.SingleOrDefault(x => x.Key == package.Key);
        try {
            var receipt = Storage.Read<PackageReceipt>(Storage.Within(directory, "receipt.json"));
            if (receipt != new PackageReceipt(1, package.Key, package.Sha512)) throw new InvalidDataException("Immutable package receipt differs: " + package.Key);
        } catch (Exception ex) when ((ex is JsonException or FileNotFoundException) && locked?.Sha512 == package.Sha512) {
            // Существующий lock подтверждает ожидаемое содержимое при утрате квитанции.
        }
    }

    private FileStream BeginOperation() {
        Storage.NoLinks(root);
        Directory.CreateDirectory(root);
        try { return new FileStream(PathIn("operation.lock"), FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None); }
        catch (IOException ex) { throw new IOException("Another package operation is running", ex); }
    }

    private FileStream UseLease(bool exclusive) {
        try { return new FileStream(PathIn("usage.lock"), FileMode.OpenOrCreate, FileAccess.Read, exclusive ? FileShare.None : FileShare.Read); }
        catch (IOException ex) { throw new IOException(exclusive ? "Package files are in use; stop consumers before repairing files" : "Package repair is running", ex); }
    }

    private InstalledState? ReadCurrent() {
        var path = PathIn("current.json");
        if (!File.Exists(path)) return null;
        var pointer = Storage.Read<StatePointer>(path);
        if (pointer.FormatVersion != 1 || !Storage.IsGeneration(pointer.Generation)) throw new InvalidDataException("Invalid current state pointer");
        var directory = PathIn("states/" + pointer.Generation);
        byte[] Read(string file, string hash) {
            var bytes = File.ReadAllBytes(Storage.Within(directory, file));
            if (PlanJson.Hash(bytes) != hash) throw new InvalidDataException("State document hash mismatch: " + file);
            return bytes;
        }
        var request = JsonSerializer.Deserialize<PlanRequest>(Read("plugins.json", pointer.RequestHash), PlanJson.Options)!;
        var locked = JsonSerializer.Deserialize<PluginLock>(Read("plugins.lock.json", pointer.LockHash), PlanJson.Options)!;
        var map = JsonSerializer.Deserialize<LoadMap>(Read("load-map.json", pointer.MapHash), PlanJson.Options)!;
        return new(pointer.Generation, directory, request, new(locked, map));
    }

    private void RecoverCore() {
        var path = PathIn("transaction.json");
        if (!File.Exists(path)) return;
        var journal = Storage.Read<TransactionJournal>(path);
        if (journal.FormatVersion != 1 || !Storage.IsGeneration(journal.Generation) ||
            (journal.PreviousGeneration != null && !Storage.IsGeneration(journal.PreviousGeneration))) throw new InvalidDataException("Invalid transaction journal");
        var current = ReadCurrent()?.Generation;
        if (current != journal.Generation && current != journal.PreviousGeneration) throw new InvalidDataException("Transaction journal refers to unrelated state");
        using var lease = journal.Repairs.Length > 0 ? UseLease(exclusive: true) : null;
        if (current != journal.Generation) RollbackRepairs(journal);
        Storage.DeleteOwnedDirectory(PathIn("staging/" + journal.Generation));
        File.Delete(path);
    }

    private void RollbackRepairs(TransactionJournal journal) {
        foreach (var key in journal.Repairs.Reverse()) {
            var backup = PathIn("staging/" + journal.Generation + "/backups/" + key);
            if (!Directory.Exists(backup)) continue;
            var destination = Storage.Within(Store, key);
            Storage.DeleteOwnedDirectory(destination);
            Directory.Move(backup, destination);
        }
    }

    private sealed class CapturingSource(ILockedPackageSource inner) : IPackageSource {
        internal Dictionary<string, byte[]> Archives { get; } = new(StringComparer.Ordinal);
        public Task<PackageListing> FindAsync(PackageKind kind, string id, CancellationToken cancellation = default) => inner.FindAsync(kind, id, cancellation);
        public async Task<PackageDownload> DownloadAsync(PackageKind kind, string id, NuGetVersion version, CancellationToken cancellation = default) {
            var package = await inner.DownloadAsync(kind, id, version, cancellation);
            Archives[package.Metadata.Id.ToLowerInvariant() + "/" + ThinkingHome.Packaging.PackageMetadata.NormalizeVersion(package.Metadata.Version)] = package.Bytes;
            return package;
        }
    }
}
