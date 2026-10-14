using ThinkingHome.Platform;
using System.Diagnostics;
using System.IO.Compression;
using System.Xml.Linq;
using ThinkingHome.Packaging;
using ThinkingHome.PackagePlanning;
using Xunit;

[assembly: CollectionBehavior(DisableTestParallelization = true)]

namespace ThinkingHome.Packaging.Tests;

public sealed class PackageFixture : IDisposable
{
    public string Root { get; }
    public string Work { get; }
    public string Good { get; }
    public string Bad { get; }
    public string Shared { get; }
    public string Embedded { get; }
    public string Transitive { get; }
    public string Library { get; }

    public PackageFixture()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory != null && !File.Exists(Path.Combine(directory.FullName, "ThinkingHome.sln"))) directory = directory.Parent;
        Root = directory?.FullName ?? throw new IOException("Repository root not found");
        Work = Path.Combine(Root, "artifacts", "packaging-tests", Guid.NewGuid().ToString("N"));
        try
        {
            Good = Build("Good", "good");
            Library = Build("Dependency", "dependency");
            Bad = Build("Bad", "bad");
            Shared = Build("Bad", "shared", "-p:SharedDependency=true");
            Embedded = Build("Embedded", "embedded");
            Transitive = Build("Transitive", "transitive");
        }
        catch
        {
            Dispose();
            throw;
        }
    }

    public void Dispose()
    {
        var parent = Path.GetFullPath(Path.Combine(Root, "artifacts", "packaging-tests")) + Path.DirectorySeparatorChar;
        var work = Path.GetFullPath(Work);
        if (!work.StartsWith(parent, StringComparison.OrdinalIgnoreCase))
            throw new IOException("Test directory is outside the artifacts directory");
        if (Directory.Exists(work)) Directory.Delete(work, recursive: true);
    }

    public string Build(string project, string name, params string[] extra)
    {
        var output = Path.Combine(Work, name);
        Directory.CreateDirectory(output);
        var result = Run("dotnet", new[] { "pack", Path.Combine(Root, "ThinkingHome.Packaging.Tests", "Fixtures", project, project + ".csproj"),
            "-o", output, "-c", "Release", "-m:1", "-p:UseSharedCompilation=false", "-p:NuGetAudit=false",
            "-p:ThinkingHomePackaging=true", "-p:ThinkingHomeValidationDirectory=" + Path.Combine(output, "inputs") }.Concat(extra).ToArray());
        Assert.True(result.Code == 0, result.Output);
        return Directory.GetFiles(output, "*.nupkg").Single();
    }

    public static string Inputs(string package) => Path.Combine(Path.GetDirectoryName(package)!, "inputs");

    public static bool IsPlugin(byte[] bytes)
    {
        try { return PackageMetadata.Read(bytes, true).Plugin != null; }
        catch (InvalidDataException ex) when (ex.Message == "Package is not a ThinkingHome plugin") { return false; }
    }

    public PlatformCatalog Platform(string rid = "win-x64") => HostPlatform.Current() with { Rid = rid };

    public string Mutate(Action<ZipArchive> change)
    {
        var target = Path.Combine(Work, Guid.NewGuid().ToString("N") + ".nupkg");
        File.Copy(Good, target);
        using var zip = ZipFile.Open(target, ZipArchiveMode.Update);
        change(zip);
        return target;
    }

    public static (int Code, string Output) Run(string command, params string[] arguments)
    {
        var start = new ProcessStartInfo(command) { RedirectStandardOutput = true, RedirectStandardError = true, UseShellExecute = false };
        foreach (var argument in arguments) start.ArgumentList.Add(argument);
        using var process = Process.Start(start)!;
        var stdout = process.StandardOutput.ReadToEndAsync();
        var stderr = process.StandardError.ReadToEndAsync();
        if (!process.WaitForExit(120000)) { process.Kill(entireProcessTree: true); throw new TimeoutException(command); }
        return (process.ExitCode, stdout.GetAwaiter().GetResult() + stderr.GetAwaiter().GetResult());
    }
}

public class PackageTests(PackageFixture fixture) : IClassFixture<PackageFixture>
{
    [Fact]
    public void Manifest_ReadsIsolatedDll_WithoutDependenciesOrExecution()
    {
        var directory = Path.Combine(fixture.Work, "isolated-marker");
        Directory.CreateDirectory(directory);
        var path = Path.Combine(directory, "Good.dll");
        using var zip = ZipFile.OpenRead(fixture.Good);
        zip.GetEntry("lib/net10.0/Good.dll")!.ExtractToFile(path);

        Assert.Equal("Fixture.Good", PluginManifest.TryRead(path)!.PackageId);
        Assert.Single(Directory.GetFiles(directory));
        Assert.DoesNotContain(AppDomain.CurrentDomain.GetAssemblies(), x => x.GetName().Name == "Good");
    }

    [Fact]
    public void Validate_AcceptsPrivateImplementation_WithoutExecutingModuleInitializer()
    {
        var result = PackageValidator.Validate(fixture.Good, PackageFixture.Inputs(fixture.Good));
        Assert.Equal("Fixture.Good", result.PackageId);
        Assert.Equal("1.2.3-beta.1", result.Version);
        Assert.Equal(new[] { "Fixture.GoodPlugin" }, result.EntryPoints);
        Assert.DoesNotContain(AppDomain.CurrentDomain.GetAssemblies(), x => x.GetName().Name == "Good");
        using var zip = ZipFile.OpenRead(fixture.Good);
        Assert.NotNull(zip.GetEntry("content/asset.txt"));
        Assert.Null(zip.GetEntry("lib/net10.0/Vendor.Dependency.dll"));
        Assert.Null(zip.GetEntry("lib/net10.0/ThinkingHome.Core.Plugins.dll"));
        Assert.NotNull(zip.GetEntry("lib/net10.0/Good.dll"));
    }

    [Theory]
    [InlineData("Direct")]
    [InlineData("Generic")]
    [InlineData("Value")]
    [InlineData("Delegate")]
    [InlineData("Changed")]
    [InlineData("constraint")]
    [InlineData("Annotated")]
    [InlineData("typeof")]
    [InlineData("Protected")]
    [InlineData("base")]
    [InlineData("interface")]
    [InlineData("NestedValue")]
    [InlineData("forwarded type")]
    public void Validate_RejectsPrivateType_InContract(string member)
    {
        var exception = Assert.Throws<InvalidDataException>(() => PackageValidator.Validate(fixture.Bad, PackageFixture.Inputs(fixture.Bad)));
        Assert.Contains(member, exception.Message);
        Assert.Contains("Fixture.Dependency", exception.Message);
        Assert.Contains("private dependency", exception.Message);
    }

    [Fact]
    public void Validate_AcceptsSameApi_WhenDependencyIsExplicitlyShared()
    {
        Assert.Equal("Fixture.Bad", PackageValidator.Validate(fixture.Shared, PackageFixture.Inputs(fixture.Shared)).PackageId);
        var manifest = PackageMetadata.Read(File.ReadAllBytes(fixture.Shared), true).Plugin!;
        Assert.Equal("shared", Assert.Single(manifest.Dependencies).Value);
        Assert.Contains("Fixture.Dependency", manifest.Dependencies.Keys);
        Assert.Empty(PackageMetadata.Read(File.ReadAllBytes(fixture.Good), true).Plugin!.Dependencies);
    }

    [Fact]
    public void Validate_RejectsSharedAnnotationOnPluginReference()
    {
        var package = fixture.Build("Runtime", "shared-plugin", "-p:SharedTimer=true");
        var error = Assert.Throws<InvalidDataException>(() => PackageValidator.Validate(package, PackageFixture.Inputs(package)));
        Assert.Contains("Plugin cannot be marked shared", error.Message);
    }

    [Fact]
    public void Build_RejectsInvalidSharedAnnotation()
    {
        var result = PackageFixture.Run("dotnet", "build", Path.Combine(fixture.Root,
            "ThinkingHome.Packaging.Tests/Fixtures/Bad/Bad.csproj"), "-m:1", "-p:UseSharedCompilation=false",
            "-p:NuGetAudit=false", "-p:SharedDependency=maybe");
        Assert.NotEqual(0, result.Code);
        Assert.Contains("ThinkingHomeShared must be true or false", result.Output);
    }

    [Fact]
    public void Validate_RejectsPrivateType_InsideExternalSharedDto()
    {
        var exception = Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(fixture.Transitive, PackageFixture.Inputs(fixture.Transitive)));
        Assert.Contains("GetData", exception.Message);
        Assert.Contains("Items", exception.Message);
        Assert.Contains("Fixture.Dependency", exception.Message);
    }

    [Fact]
    public void Validate_AcceptsDeclaredEmbeddedLibrary()
    {
        Assert.Equal("Fixture.Embedded", PackageValidator.Validate(fixture.Embedded, PackageFixture.Inputs(fixture.Embedded)).PackageId);
        using var zip = ZipFile.OpenRead(fixture.Embedded);
        Assert.NotNull(zip.GetEntry("lib/net10.0/Vendor.Dependency.dll"));
    }

    [Theory]
    [InlineData("id", "Different.Plugin", "ID mismatch")]
    [InlineData("version", "9.0.0", "version mismatch")]
    public void Validate_RejectsNuspecMismatch(string field, string value, string error)
    {
        var package = fixture.Mutate(zip =>
        {
            var spec = zip.Entries.Single(x => x.FullName.EndsWith(".nuspec"));
            XDocument document;
            using (var stream = spec.Open()) document = XDocument.Load(stream);
            document.Descendants().Single(x => x.Name.LocalName == field).Value = value;
            var name = spec.FullName;
            spec.Delete();
            using var output = zip.CreateEntry(name).Open();
            document.Save(output);
        });
        Assert.Contains(error, Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(fixture.Good))).Message);
    }

    [Fact]
    public void Validate_RejectsUndeclaredBundledDependency()
    {
        var package = fixture.Mutate(zip => zip.CreateEntryFromFile(Path.Combine(fixture.Root,
            "ThinkingHome.Packaging.Tests", "Fixtures", "Dependency", "bin", "Release", "net10.0", "Vendor.Dependency.dll"),
            "lib/net10.0/Vendor.Dependency.dll"));
        Assert.Contains("Undeclared bundled assembly", Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(fixture.Good))).Message);
    }

    [Theory]
    [InlineData("../escape.dll")]
    [InlineData("/absolute.dll")]
    [InlineData("C:/absolute.dll")]
    public void Validate_RejectsUnsafeArchivePath(string path)
    {
        var package = fixture.Mutate(zip => zip.CreateEntry(path));
        Assert.Contains("Unsafe package path", Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(fixture.Good))).Message);
    }

    [Fact]
    public void Pack_DoesNotExposeInvalidPackage()
    {
        var output = Path.Combine(fixture.Work, "rejected");
        var result = PackageFixture.Run("dotnet", typeof(PackageValidator).Assembly.Location, "pack",
            Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests", "Fixtures", "Bad", "Bad.csproj"), output);
        Assert.NotEqual(0, result.Code);
        Assert.Contains("private dependency", result.Output);
        Assert.Empty(Directory.GetFiles(output, "*.nupkg"));
        Assert.Empty(Directory.GetDirectories(output, ".staging-*"));
    }

    [Theory]
    [InlineData("-p:MetadataCase=DUPLICATE_METADATA", "Duplicate manifest key")]
    [InlineData("-p:MetadataCase=UNKNOWN_METADATA", "Unknown plugin metadata")]
    [InlineData("-p:MetadataCase=NO_ENTRY_POINTS", "No plugin entry points")]
    public void Validate_RejectsMalformedManifest(string property, string error)
    {
        var package = fixture.Build("Good", Guid.NewGuid().ToString("N"), property);
        Assert.Contains(error, Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(package))).Message);
    }

    [Fact]
    public void Validate_RejectsMissingNuspecDependency()
    {
        var package = fixture.Mutate(zip =>
        {
            var entry = zip.Entries.Single(x => x.FullName.EndsWith(".nuspec"));
            XDocument document;
            using (var stream = entry.Open()) document = XDocument.Load(stream);
            document.Descendants().Single(x => x.Name.LocalName == "dependency" &&
                x.Attribute("id")?.Value == "Fixture.Dependency").Remove();
            var name = entry.FullName;
            entry.Delete();
            using var output = zip.CreateEntry(name).Open();
            document.Save(output);
        });
        Assert.Contains("missing from nuspec", Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(fixture.Good))).Message);
    }

    [Fact]
    public void Validate_RejectsDependencyRangeMismatch()
    {
        var package = fixture.Mutate(zip =>
        {
            var entry = zip.Entries.Single(x => x.FullName.EndsWith(".nuspec"));
            XDocument document;
            using (var stream = entry.Open()) document = XDocument.Load(stream);
            document.Descendants().Single(x => x.Name.LocalName == "dependency" &&
                x.Attribute("id")?.Value == "Fixture.Dependency").SetAttributeValue("version", "[99.0.0]");
            var name = entry.FullName;
            entry.Delete();
            using var output = zip.CreateEntry(name).Open();
            document.Save(output);
        });
        Assert.Contains("does not satisfy nuspec", Assert.Throws<InvalidDataException>(() =>
            PackageValidator.Validate(package, PackageFixture.Inputs(fixture.Good))).Message);
    }

    [Fact]
    public void Validate_RejectsMissingReference_InsteadOfSkippingInspection()
    {
        var inputs = Path.Combine(fixture.Work, "missing-reference");
        Directory.CreateDirectory(inputs);
        foreach (var file in Directory.GetFiles(PackageFixture.Inputs(fixture.Good)))
            File.Copy(file, Path.Combine(inputs, Path.GetFileName(file)));
        var references = Path.Combine(inputs, "references.txt");
        File.WriteAllLines(references, File.ReadAllLines(references).Where(x => !x.EndsWith("Vendor.Dependency.dll")));
        Assert.Throws<FileNotFoundException>(() => PackageValidator.Validate(fixture.Good, inputs));
    }

    [Fact]
    public void Pack_PreservesExistingVersion()
    {
        var output = Path.Combine(fixture.Work, "existing");
        Directory.CreateDirectory(output);
        var destination = Path.Combine(output, Path.GetFileName(fixture.Good));
        File.Copy(fixture.Good, destination);
        var original = File.ReadAllBytes(destination);
        var result = PackageFixture.Run("dotnet", typeof(PackageValidator).Assembly.Location, "pack",
            Path.Combine(fixture.Root, "ThinkingHome.Packaging.Tests", "Fixtures", "Good", "Good.csproj"), output);
        Assert.NotEqual(0, result.Code);
        Assert.Equal(original, File.ReadAllBytes(destination));
        Assert.Empty(Directory.GetDirectories(output, ".staging-*"));
    }
}
