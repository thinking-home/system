using System;

namespace ThinkingHome.Plugins.UniUi.Model
{
    public class Panel
    {
        public Guid Id { get; set; }

        public Dashboard Dashboard { get; set; }

        public string Title { get; set; }

        public int SortOrder { get; set; }
    }
}
