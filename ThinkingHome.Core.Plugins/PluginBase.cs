using System;
using System.Collections.Generic;
using System.Composition;
using System.Linq;
using System.Threading.Tasks;
using NLog;

namespace ThinkingHome.Core.Plugins
{
    public class PluginBase
    {
        #region fields

        [Import("DCCEE19A-2CEA-423F-BFE5-AE5E12679938")]
        public IServiceContext Context { get; set; }

        private readonly Logger logger;

        #endregion

        #region life cycle

        protected PluginBase()
        {
            logger = LogManager.GetLogger(GetType().FullName);
        }

        public virtual void InitPlugin()
        {
            logger.Warn("init plugin {0}", GetType().FullName);

            foreach (var plugin in Context.GetAllPlugins())
            {
                logger.Warn("- {0}", plugin.GetType().FullName);
            }
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