using System.CommandLine;
using ThinkingHome.Console;

var root = new RootCommand("ThinkingHome host and plugin package manager");
root.Subcommands.Add(HostCommand.Create());
PackageCommands.Configure(root);
var parsed = root.Parse(args.Length == 0 ? new[] { "run" } : args);
var exitCode = await parsed.InvokeAsync();
return parsed.Errors.Count == 0 ? exitCode : 2;
