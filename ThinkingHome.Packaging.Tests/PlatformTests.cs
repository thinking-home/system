using ThinkingHome.Platform;
using Xunit;

namespace ThinkingHome.Packaging.Tests;

public class PlatformTests
{
    [Fact]
    public void Graph_IncludesTransitivePackages_WithoutUsingAssemblyNameAsPackageId()
    {
        var result = Read("""
            "Core/1.0.0": { "dependencies": { "Vendor.Package": "2.0.0" } },
            "Vendor.Package/2.0.0": {
                "dependencies": { "Transitive": "3.0.0", "Framework": "10.0.0" },
                "runtime": { "lib/net10.0/Different.Assembly.dll": {} }
            },
            "Transitive/3.0.0": { "runtime": { "lib/net10.0/Transitive.dll": {} } },
            "Unrelated.Cli/4.0.0": { "runtime": { "Cli.dll": {} } }
            """);

        Assert.Equal(new[] { "Core", "Transitive", "Vendor.Package" }, result.Select(x => x.Id));
        var dependency = result.Single(x => x.Id == "Vendor.Package");
        Assert.Equal("2.0.0", dependency.Version);
        Assert.Equal("lib/net10.0/Different.Assembly.dll", Assert.Single(dependency.Assemblies));
    }

    [Fact]
    public void Graph_RejectsMissingDependency_InsteadOfSilentlyOmittingIt()
    {
        var error = Assert.Throws<InvalidDataException>(() => Read("""
            "Core/1.0.0": { "dependencies": { "Missing": "1.0.0" } }
            """));

        Assert.Contains("Missing", error.Message);
    }

    [Fact]
    public void Graph_UsesOnlyRuntimeAssetsAvailableInTheCurrentProcess()
    {
        var result = Read("""
            "Core/1.0.0": {
                "runtimeTargets": {
                    "runtimes/win-x64/lib/net10.0/Windows.dll": { "assetType": "runtime" },
                    "runtimes/linux-x64/lib/net10.0/Linux.dll": { "assetType": "runtime" },
                    "runtimes/win-x64/native/native.dll": { "assetType": "native" }
                }
            }
            """, ["Windows"]);

        Assert.Equal("runtimes/win-x64/lib/net10.0/Windows.dll", Assert.Single(Assert.Single(result).Assemblies));
    }

    [Fact]
    public void Platform_IncludesFrameworkLibrariesBeyondCoreReferences()
    {
        var platform = HostPlatform.Current();
        Assert.Contains("Microsoft.Extensions.Caching.Memory", platform.Packages.Keys);
        Assert.Contains("System.Security.Cryptography.Pkcs", platform.Packages.Keys);
        Assert.DoesNotContain("NuGet.Protocol", platform.Packages.Keys);
        Assert.DoesNotContain("System.CommandLine", platform.Packages.Keys);
    }

    private static PlatformDependency[] Read(string libraries, string[]? available = null)
    {
        var path = Path.GetTempFileName();
        try
        {
            File.WriteAllText(path, """
                { "runtimeTarget": { "name": "net10.0" }, "targets": { "net10.0": {
                """ + libraries + "} } }");
            return DependencyGraph.Read([path], "Core", ["Framework"], available ?? []);
        }
        finally
        {
            File.Delete(path);
        }
    }
}
