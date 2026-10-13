using System.IO.Compression;
using ThinkingHome.PackagePlanning;
using ThinkingHome.Packaging;

namespace ThinkingHome.PackageManagement;

internal static class PackageStore {
    internal static void CheckArchive(LockedPackage package, byte[] bytes) {
        if (bytes.Length > 64 * 1024 * 1024 || PlanJson.Hash(bytes) != package.Sha512) throw new InvalidDataException("Archive hash mismatch: " + package.Key);
        var metadata = PackageMetadata.Read(bytes, package.Kind == "plugin");
        if (!string.Equals(metadata.Id, package.Id, StringComparison.OrdinalIgnoreCase) || PackageMetadata.NormalizeVersion(metadata.Version) != package.Version)
            throw new InvalidDataException("Archive identity mismatch: " + package.Key);
        using var archive = new ZipArchive(new MemoryStream(bytes));
        var files = archive.Entries.Where(x => !x.FullName.EndsWith('/')).OrderBy(x => x.FullName, StringComparer.Ordinal).ToArray();
        if (!files.Select(x => x.FullName).SequenceEqual(package.Files.Select(x => x.Path))) throw new InvalidDataException("Archive inventory differs from lock: " + package.Key);
        foreach (var (entry, file) in files.Zip(package.Files)) {
            Storage.Within(Path.GetTempPath(), file.Path);
            using var input = entry.Open();
            if (Convert.ToHexString(System.Security.Cryptography.SHA512.HashData(input)) != file.Sha512) throw new InvalidDataException("Archive file hash mismatch: " + file.Path);
        }
    }

    internal static void Extract(string destination, LockedPackage package, byte[] bytes) {
        CheckArchive(package, bytes);
        Directory.CreateDirectory(Storage.Within(destination, "files"));
        Storage.Write(Storage.Within(destination, "package.nupkg"), bytes);
        using var archive = new ZipArchive(new MemoryStream(bytes));
        foreach (var entry in archive.Entries.Where(x => !x.FullName.EndsWith('/'))) {
            using var input = entry.Open();
            using var output = new MemoryStream();
            input.CopyTo(output);
            Storage.Write(Storage.Within(destination, "files/" + entry.FullName), output.ToArray());
        }
        Storage.Write(Storage.Within(destination, "receipt.json"), PlanJson.Bytes(new PackageReceipt(1, package.Key, package.Sha512)));
        Verify(destination, package);
    }

    internal static byte[] Verify(string directory, LockedPackage package) {
        var receipt = Storage.Read<PackageReceipt>(Storage.Within(directory, "receipt.json"));
        if (receipt != new PackageReceipt(1, package.Key, package.Sha512)) throw new InvalidDataException("Package receipt mismatch: " + package.Key);
        var expected = package.Files.Select(x => "files/" + x.Path).Append("package.nupkg").Append("receipt.json").Order(StringComparer.Ordinal).ToArray();
        if (!Storage.Files(directory).SequenceEqual(expected)) throw new InvalidDataException("Installed file inventory mismatch: " + package.Key);
        foreach (var file in package.Files) {
            using var input = File.OpenRead(Storage.Within(directory, "files/" + file.Path));
            if (Convert.ToHexString(System.Security.Cryptography.SHA512.HashData(input)) != file.Sha512) throw new InvalidDataException("Installed file hash mismatch: " + package.Key + "/" + file.Path);
        }
        var archivePath = Storage.Within(directory, "package.nupkg");
        if (new FileInfo(archivePath).Length > 64 * 1024 * 1024) throw new InvalidDataException("Installed archive exceeds size limit: " + package.Key);
        var bytes = File.ReadAllBytes(archivePath);
        CheckArchive(package, bytes);
        return bytes;
    }
}
