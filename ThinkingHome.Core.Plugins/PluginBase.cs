using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins.Utils;

namespace ThinkingHome.Core.Plugins
{
    public abstract class PluginBase
    {
        #region properties

        public IServiceContext Context { get; set; }

        public ILogger Logger { get; set; }

        public IConfigurationSection Configuration { get; set; }

        #endregion

        #region life cycle

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
