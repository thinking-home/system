using System.Composition;
using NLog;

namespace ThinkingHome.Core.Plugins
{
    public abstract class PluginBase
    {
        #region properties

        [Import("DCCEE19A-2CEA-423F-BFE5-AE5E12679938")]
        public IServiceContext Context { get; set; }

        protected Logger Logger { get; }

        #endregion

        #region life cycle

        protected PluginBase()
        {
            Logger = LogManager.GetLogger(GetType().FullName);
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