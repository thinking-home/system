using System;

namespace ThinkingHome.Plugins.UniUi.Model
{
    public class Widget
    {
        public Guid Id { get; set; }

        public Panel Panel { get; set; }

        public string TypeAlias { get; set; }

        public string DisplayName { get; set; }

        public int SortOrder { get; set; }
    }
}