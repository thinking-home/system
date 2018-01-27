using System;

namespace ThinkingHome.Plugins.UniUi.Model
{
    public class WidgetParameter
    {
        public Guid Id { get; set; }

        public Widget Widget { get; set; }

        public string Name { get; set; }

        public Guid? ValueGuid { get; set; }

        public int? ValueInt { get; set; }

        public string ValueString { get; set; }
    }
}