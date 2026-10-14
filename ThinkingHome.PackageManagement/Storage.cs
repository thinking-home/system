using System.Text.Json;
using System.Text.RegularExpressions;
using ThinkingHome.PackagePlanning;

namespace ThinkingHome.PackageManagement;

internal sealed record StatePointer(int FormatVersion, string Generation, string RequestHash, string LockHash,
    string MapHash, string? ConfigurationHash = null);

internal sealed record PackageReceipt(int FormatVersion, string Key, string Sha512);

internal sealed record TransactionJournal(int FormatVersion, string Generation, string? PreviousGeneration, string[] Repairs);

/// <summary>
/// Опубликованное поколение установки, его каталог, исходный запрос и проверенный план.
/// </summary>
public sealed record InstalledState(string Generation, string Directory, PlanRequest Request, InstallationPlan Plan);

// Держать весь срок использования DLL. Новые версии могут устанавливаться; восстановление повреждённых файлов блокируется.
/// <summary>
/// Удерживает файлы поколения установки на всё время их использования потребителем.
/// </summary>
public sealed class InstallationSnapshot : IDisposable
{
    private readonly FileStream lease;
    private readonly string store;

    internal InstallationSnapshot(FileStream lease, InstalledState state, string store)
    {
        this.lease = lease;
        State = state;
        this.store = store;
    }

    /// <summary>
    /// Состояние поколения, зафиксированное при открытии снимка.
    /// </summary>
    public InstalledState State { get; }

    /// <summary>
    /// Возвращает каталог распакованных файлов пакета, принадлежащего этому снимку.
    /// </summary>
    public string PackageDirectory(string key)
    {
        if (!State.Plan.Lock.Packages.Any(x => x.Key == key))
        {
            throw new KeyNotFoundException(key);
        }

        return Storage.Within(store, key + "/files");
    }

    /// <summary>
    /// Освобождает блокировку использования файлов установки.
    /// </summary>
    public void Dispose() => lease.Dispose();
}

internal static class Storage
{
    internal static string Within(string root, string relative)
    {
        if (string.IsNullOrEmpty(relative) || relative.Contains('\\') || Path.IsPathRooted(relative))
        {
            throw new InvalidDataException("Unsafe relative path: " + relative);
        }

        foreach (var part in relative.Split('/'))
        {
            if (part.Length == 0 || part is "." or ".." || part.EndsWith('.') || part.EndsWith(' ') || part.Any(x => x < 32
                || "<>:\"|?*".Contains(x)))
            {
                throw new InvalidDataException("Unsafe path component: " + relative);
            }

            var stem = part.Split('.')[0];

            if (Regex.IsMatch(stem, "^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$", RegexOptions.IgnoreCase))
            {
                throw new InvalidDataException("Reserved path component: " + relative);
            }
        }

        root = Path.GetFullPath(root);
        var path = Path.GetFullPath(Path.Combine(root, relative.Replace('/', Path.DirectorySeparatorChar)));

        if (!path.StartsWith(root.TrimEnd(Path.DirectorySeparatorChar) + Path.DirectorySeparatorChar,
            OperatingSystem.IsWindows() ? StringComparison.OrdinalIgnoreCase : StringComparison.Ordinal))
        {
            throw new InvalidDataException("Path escapes installation: " + relative);
        }

        NoLinks(path);

        return path;
    }

    internal static void NoLinks(string path)
    {
        for (var current = Path.GetFullPath(path); current != null; current = Path.GetDirectoryName(current))
        {
            if ((File.Exists(current) || Directory.Exists(current)) && (File.GetAttributes(current) & FileAttributes.ReparsePoint) != 0)
            {
                throw new IOException("Symbolic links and junctions are not allowed in package storage: " + current);
            }
        }
    }

    internal static string[] Files(string directory)
    {
        NoLinks(directory);
        var result = new List<string>();

        void Visit(string folder)
        {
            foreach (var entry in Directory.EnumerateFileSystemEntries(folder))
            {
                NoLinks(entry);

                if (Directory.Exists(entry))
                {
                    Visit(entry);
                }
                else
                {
                    result.Add(Path.GetRelativePath(directory, entry).Replace('\\', '/'));
                }
            }
        }

        Visit(directory);

        return result.Order(StringComparer.Ordinal).ToArray();
    }

    internal static void Write(string path, byte[] bytes)
    {
        NoLinks(path);
        Directory.CreateDirectory(Path.GetDirectoryName(path)!);
        using var output = new FileStream(path, FileMode.CreateNew, FileAccess.Write, FileShare.None);
        output.Write(bytes);
        output.Flush(flushToDisk: true);
    }

    internal static void Replace(string path, byte[] bytes)
    {
        NoLinks(path);
        var temporary = path + "." + Guid.NewGuid().ToString("N") + ".tmp";

        try
        {
            Write(temporary, bytes);
            File.Move(temporary, path, overwrite: true);
        }
        finally
        {
            if (File.Exists(temporary))
            {
                File.Delete(temporary);
            }
        }
    }

    internal static void DeleteOwnedDirectory(string path)
    {
        if (!Directory.Exists(path))
        {
            return;
        }

        Files(path); // Перед рекурсивным удалением исключаем перенаправление через ссылки.
        Directory.Delete(path, recursive: true);
    }

    internal static T Read<T>(string path)
    {
        NoLinks(path);
        using var input = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read | FileShare.Delete);

        return JsonSerializer.Deserialize<T>(input, PlanJson.Options) ?? throw new InvalidDataException("Empty document: " + path);
    }

    internal static bool IsGeneration(string value) => Guid.TryParseExact(value, "N", out _);
}
