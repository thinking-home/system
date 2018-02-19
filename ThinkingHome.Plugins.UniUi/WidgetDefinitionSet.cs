using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.UniUi.Widgets;

namespace ThinkingHome.Plugins.UniUi
{
    public class WidgetDefinitionSet : IWidgetDefinitionSet
    {
        private readonly IServiceContext context;
        private readonly ILogger logger;
        private readonly ConcurrentDictionary<string, WidgetDefinition> defs = new ConcurrentDictionary<string, WidgetDefinition>();

        public WidgetDefinitionSet(IServiceContext context, ILogger logger)
        {
            this.context = context;
            this.logger = logger;
        }

        public void Add<T>(string alias) where T : WidgetDefinition, new()
        {
            defs.AddOrUpdate(alias,
                key => new T { Context = context, Logger = logger },
                (key, value) => throw new InvalidOperationException($"Duplicated widget alias {alias}"));
        }

        public IReadOnlyDictionary<string, WidgetDefinition> Definitions => defs;
    }
}
