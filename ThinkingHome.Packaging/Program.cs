using System.Diagnostics;
using ThinkingHome.Packaging;

try {
    if (args.Length == 3 && args[0] == "validate") {
        var result = PackageValidator.Validate(Path.GetFullPath(args[1]), Path.GetFullPath(args[2]));
        Console.WriteLine($"Validated {result.PackageId} {result.Version}");
        return 0;
    }
    if (args.Length != 3 || args[0] != "pack") {
        Console.Error.WriteLine("Usage: ThinkingHome.Packaging pack <project.csproj> <output-directory>\n"
            + "       ThinkingHome.Packaging validate <package.nupkg> <validation-inputs-directory>");
        return 2;
    }
    var project = Path.GetFullPath(args[1]);
    var output = Path.GetFullPath(args[2]);
    Directory.CreateDirectory(output);
    var staging = Path.Combine(output, ".staging-" + Guid.NewGuid().ToString("N"));
    Directory.CreateDirectory(staging);
    try {
        var inputs = Path.Combine(staging, "validation");
        var start = new ProcessStartInfo("dotnet") { UseShellExecute = false };
        foreach (var argument in new[] { "pack", project, "-c", "Release", "-o", staging, "-m:1",
            "-p:UseSharedCompilation=false", "-p:NuGetAudit=false", "-p:ThinkingHomePackaging=true",
            "-p:ThinkingHomeValidationDirectory=" + inputs }) start.ArgumentList.Add(argument);
        using var process = Process.Start(start) ?? throw new IOException("Could not start dotnet pack");
        process.WaitForExit();
        if (process.ExitCode != 0) return process.ExitCode;
        var packages = Directory.GetFiles(staging, "*.nupkg");
        if (packages.Length != 1) throw new InvalidDataException("Expected exactly one package");
        var result = PackageValidator.Validate(packages[0], inputs);
        var destination = Path.Combine(output, Path.GetFileName(packages[0]));
        // Уже опубликованная версия не перезаписывается; перемещение в том же каталоге атомарно.
        File.Move(packages[0], destination, overwrite: false);
        Console.WriteLine($"Validated and packed {result.PackageId} {result.Version}: {destination}");
    } finally { Directory.Delete(staging, recursive: true); }
    return 0;
} catch (Exception exception) {
    Console.Error.WriteLine("Plugin packaging failed: " + exception.Message);
    return 1;
}
