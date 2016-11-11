using System.Composition;
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

        }

        public virtual void StartPlugin()
        {

        }

        public virtual void StopPlugin()
        {

        }

        #endregion
    }
}