namespace ThinkingHome.Plugins.UniUi.Widgets
{
    public class WidgetSelectItem
    {
        public WidgetSelectItem(object id, string displayName)
        {
            Id = id;
            DisplayName = displayName;
        }

        public object Id { get; set; }

        public string DisplayName { get; set; }
    }
}
