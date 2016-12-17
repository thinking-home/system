using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using ThinkingHome.Core.Infrastructure;
using ThinkingHome.Plugins.Database;
using ThinkingHome.Plugins.Scripts;
using ThinkingHome.Plugins.Timer;
using ThinkingHome.Plugins.Tmp;

namespace ThinkingHome.Console
{
    internal class Program
    {
        public static void Main(string[] args)
        {
//            var name = new AssemblyName{ Name = "ThinkingHome.Migrator" };
//            var asm = Assembly.Load(name);
//
//            System.Console.WriteLine(asm.FullName);
//
//            foreach (var referencedAssembly in asm.GetReferencedAssemblies())
//            {
//                System.Console.WriteLine(referencedAssembly.FullName);
//            }
//
//            return;

            var app = new HomeApplication();

            var timerAssembly = typeof(TimerPlugin).GetTypeInfo().Assembly;
            var tmpAssembly = typeof(TmpPlugin).GetTypeInfo().Assembly;
            var dbAssembly = typeof(DatabasePlugin).GetTypeInfo().Assembly;
            var jsAssembly = typeof(ScriptsPlugin).GetTypeInfo().Assembly;

            app.Init(timerAssembly, tmpAssembly, dbAssembly, jsAssembly);
            app.StartServices();

            System.Console.WriteLine("Service is available. Press ENTER to exit.");
            System.Console.ReadLine();

            app.StopServices();
        }
    }
}