using System;
using System.Reflection;
using ThinkingHome.Core.Infrastructure;

namespace ThinkingHome.Console
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            var config = new HomeConfiguration();
            var app = new HomeApplication();

            app.Init(config);
            app.StartServices();

            System.Console.WriteLine("Service is available. Press ENTER to exit.");
            System.Console.ReadLine();

            app.StopServices();
        }
    }
}
