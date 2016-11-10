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
            var cls = new HomeApplication();
            cls.Init();
        }
    }
}