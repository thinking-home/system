using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi.Apps
{
    public class AppSectionAttribute : JavaScriptResourceAttribute
    {
        public AppSectionAttribute(SectionType type, string title, string url, string resourcePath) : base(url, resourcePath)
        {
            Type = type;
            Title = title;
        }

        public SectionType Type { get; set; }

        public string Title { get; set; }

        public int SortOrder { get; set; }
    }
}