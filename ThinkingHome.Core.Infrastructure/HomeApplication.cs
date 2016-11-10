using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NLog;

namespace ThinkingHome.Core.Infrastructure
{
    public class HomeApplication
    {
        private readonly Logger logger = LogManager.GetCurrentClassLogger();

        public void Init()
        {
            logger.Info("init application!!!!");
        }
    }
}