using System.Security.Cryptography;
using System.Text.Json;
using ThinkingHome.Packaging;

namespace ThinkingHome.Repository;

public sealed record RepositoryPackage(PackageMetadata Metadata, byte[] Bytes, string Hash);

public sealed class RepositoryCatalog : IDisposable {
    private readonly FileStream lease;
    public IReadOnlyDictionary<string, RepositoryPackage> Packages { get; }
    public static string Key(string id, string version) => id.ToLowerInvariant() + "/" + version.ToLowerInvariant();

    public RepositoryCatalog(string folder) {
        folder = Path.GetFullPath(folder);
        if (!Directory.Exists(folder)) throw new DirectoryNotFoundException(folder);
        var state = Path.Combine(folder, ".thinkinghome-repository");
        Directory.CreateDirectory(state);
        lease = new FileStream(Path.Combine(state, "lock"), FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None);
        try {
            var ledgerPath = Path.Combine(state, "hashes.json");
            var ledger = File.Exists(ledgerPath)
                ? JsonSerializer.Deserialize<Dictionary<string, string>>(File.ReadAllText(ledgerPath))!
                : new Dictionary<string, string>();
            var packages = new Dictionary<string, RepositoryPackage>(StringComparer.OrdinalIgnoreCase);
            foreach (var path in Directory.GetFiles(folder, "*.nupkg").Order(StringComparer.Ordinal)) {
                if (new FileInfo(path).Length > 64L * 1024 * 1024) throw new InvalidDataException("Package exceeds 64 MiB: " + path);
                var bytes = File.ReadAllBytes(path);
                var metadata = PackageMetadata.Read(bytes, requirePlugin: true);
                var key = Key(metadata.Id, PackageMetadata.NormalizeVersion(metadata.Version));
                var hash = Convert.ToHexString(SHA512.HashData(bytes));
                if (ledger.TryGetValue(key, out var previous) && hash != previous)
                    throw new InvalidDataException("Published version changed: " + key);
                if (packages.TryGetValue(key, out var duplicate) && duplicate.Hash != hash)
                    throw new InvalidDataException("Conflicting package files: " + key);
                packages[key] = new(metadata, bytes, hash);
                ledger[key] = hash;
            }
            var temporary = ledgerPath + "." + Guid.NewGuid().ToString("N") + ".tmp";
            try {
                File.WriteAllText(temporary, JsonSerializer.Serialize(ledger));
                File.Move(temporary, ledgerPath, overwrite: true);
            } finally { if (File.Exists(temporary)) File.Delete(temporary); }
            Packages = packages;
        } catch { lease.Dispose(); throw; }
    }

    public void Dispose() => lease.Dispose();
}
