using System;

namespace ThinkingHome.Core.Plugins.Utils
{
    public class PluginMethodInfo<TAttribute, TDelegate> where TAttribute: Attribute where TDelegate: class
    {
        public TAttribute MetaData { get; }

        public TDelegate Method { get; }

        public PluginMethodInfo(TAttribute metaData, TDelegate method)
        {
            MetaData = metaData;
            Method = method;
        }
    }
}
