using System;
using System.Composition;
using System.Linq;
using System.Threading.Tasks;
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

        public void GenerateEvent<T>(T handler, Action<T> action, bool runAsync = false)
        {
            if (handler == null) return;

            var context = new EventContext<T>(handler, action, Logger);

            if (runAsync)
            {
                Task.Factory.StartNew(context.Start);
            }
            else
            {
                context.Start();
            }
        }
    }
}