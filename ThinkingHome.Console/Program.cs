using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ThinkingHome.Core.Infrastructure;

namespace ThinkingHome.Console
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            var app = new HomeApplication();

            app.Init();
            app.StartServices();

            System.Console.WriteLine("Service is available. Press ENTER to exit.");
            System.Console.ReadLine();

            app.StopServices();
        }
    }
}