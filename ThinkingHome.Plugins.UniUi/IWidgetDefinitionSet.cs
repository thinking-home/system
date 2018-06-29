using ThinkingHome.Plugins.UniUi.Widgets;

namespace ThinkingHome.Plugins.UniUi
{
    public interface IWidgetDefinitionSet
    {
        void Add<T>(string alias) where T : WidgetDefinition, new();
    }
}
