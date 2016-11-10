using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NLog;

namespace ThinkingHome.Core.Plugins
{
    public class PluginBase
    {
        private readonly Logger logger;

        #region life cycle

        protected PluginBase()
        {
            logger = LogManager.GetLogger(GetType().FullName);
        }

        public virtual void InitPlugin()
        {
            logger.Warn("init plugin");
        }

        public virtual void StartPlugin()
        {
            logger.Warn("start plugin");
        }

        public virtual void StopPlugin()
        {
            logger.Warn("stop plugin");
        }

        #endregion
    }
}