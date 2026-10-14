using System.Collections;
using System.Reflection;
using System.Runtime.Loader;
using ThinkingHome.PackageRuntime;
using ThinkingHome.Platform;

using var runtime = PluginRuntime.Open(args.Single(), HostPlatform.Current());

// Создаём плагины через реальные контексты загрузки и связываем обработчик модели.
var databaseType = runtime.PluginTypes.Single(x => x.Name == "DatabasePlugin");
var scriptsType = runtime.PluginTypes.Single(x => x.Name == "ScriptsPlugin");
var database = Activator.CreateInstance(databaseType)!;
var scripts = Activator.CreateInstance(scriptsType, database)!;

var callbackType = databaseType.Assembly.GetType("ThinkingHome.Plugins.Database.DbModelBuilderDelegate")!;
var callback = scriptsType.GetMethod("InitModel")!.CreateDelegate(callbackType, scripts);
var callbacks = Array.CreateInstance(callbackType, 1);
callbacks.SetValue(callback, 0);
databaseType.GetField("inits", BindingFlags.NonPublic | BindingFlags.Instance)!.SetValue(database, callbacks);

// Настройка провайдера нужна для построения модели, но соединение с БД не открывается.
var builder = databaseType.GetField("optionsBuilder", BindingFlags.NonPublic | BindingFlags.Instance)!.GetValue(database)!;
var provider = AssemblyLoadContext.GetLoadContext(databaseType.Assembly)!.LoadFromAssemblyName(new AssemblyName("Npgsql.EntityFrameworkCore.PostgreSQL"));
var configure = provider.GetType("Microsoft.EntityFrameworkCore.NpgsqlDbContextOptionsBuilderExtensions")!.GetMethods()
    .Single(x => x.Name == "UseNpgsql" && !x.IsGenericMethod && x.GetParameters() is { Length: 3 } parameters
    && parameters[0].ParameterType.Name == "DbContextOptionsBuilder" && parameters[1].ParameterType == typeof(string));
configure.Invoke(null, [builder, "Host=localhost;Database=unused;Username=unused", null]);

// Проверяем и вклад Scripts в модель, и общую идентичность типов EF.
using var session = (IDisposable)databaseType.GetMethod("OpenSession")!.Invoke(database, null)!;
var model = session.GetType().GetProperty("Model")!.GetValue(session)!;
var modelContract = model.GetType().GetInterfaces().Single(x => x.FullName == "Microsoft.EntityFrameworkCore.Metadata.IReadOnlyModel");
var entities = (IEnumerable)modelContract.GetMethod("GetEntityTypes")!.Invoke(model, null)!;

if (entities.Cast<object>().Count() < 2)
{
    throw new Exception("EF model did not include Scripts entities");
}

if (callbackType.GetMethod("Invoke")!.GetParameters()[0].ParameterType != scriptsType.GetMethod("InitModel")!.GetParameters()[0].ParameterType)
{
    throw new Exception("ModelBuilder identity differs");
}

if (AssemblyLoadContext.GetLoadContext(callbackType.GetMethod("Invoke")!.GetParameters()[0].ParameterType.Assembly)!.Name != "ThinkingHome:shared")
{
    throw new Exception("EF is not shared");
}

Console.WriteLine("EF shared identity and model verified without database connection");
