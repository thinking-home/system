using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.WebUi.Apps
{
    public class AppSectionAttribute : JavaScriptResourceAttribute
    {
        public AppSectionAttribute(string title, string url, string resourcePath) : base(url, resourcePath)
        {
            Title = title;
        }

        public string Title { get; set; }

        public int SortOrder { get; set; }
    }
}