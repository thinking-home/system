using ThinkingHome.Repository;

if (args.Length is < 1 or > 2) {
    Console.Error.WriteLine("Usage: ThinkingHome.Repository <package-directory> [http://127.0.0.1:5088]");
    return 2;
}
try {
    await using var app = RepositoryServer.Create(args[0], args.Length == 2 ? args[1] : "http://127.0.0.1:5088");
    await app.RunAsync();
    return 0;
} catch (Exception exception) {
    Console.Error.WriteLine("Repository failed: " + exception.Message);
    return 1;
}
