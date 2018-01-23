using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
using ThinkingHome.Plugins.WebServer.Attributes;
using ThinkingHome.Plugins.WebUi.Apps;
using ThinkingHome.Plugins.WebUi.Attributes;

namespace ThinkingHome.Plugins.Scripts.WebUi
{
    [AppSection(SectionType.System, "Scripts", "/static/scripts/web-ui/list.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list.js", Icon = "code", SortOrder = 20)]
    [JavaScriptResource("/static/scripts/web-ui/editor.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.editor.js")]

    [AppSection(SectionType.System, "Script events", "/static/scripts/web-ui/subscriptions.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.subscriptions.js", SortOrder = 22)]

    // templates
    [TemplateResource("/static/scripts/web-ui/list.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list.tpl")]
    [TemplateResource("/static/scripts/web-ui/list-item.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.list-item.tpl")]
    [TemplateResource("/static/scripts/web-ui/editor.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.editor.tpl")]
    [TemplateResource("/static/scripts/web-ui/subscriptions.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.subscriptions.tpl")]
    [TemplateResource("/static/scripts/web-ui/subscriptions-item.tpl", "ThinkingHome.Plugins.Scripts.WebUi.Resources.subscriptions-item.tpl")]

    // i18n
    [HttpLocalizationResource("/static/scripts/web-ui/lang.json")]

    // vendor
    [JavaScriptResource("/vendor/js/codemirror.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.js", Alias = "codemirror")]
    [JavaScriptResource("/vendor/js/codemirror-javascript.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror-javascript.js", Alias = "codemirror-javascript")]
    [JavaScriptResource("/vendor/js/codemirror-fullscreen.js", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror-fullscreen.js", Alias = "codemirror-fullscreen")]
    [CssResource("/vendor/css/codemirror.css", "ThinkingHome.Plugins.Scripts.WebUi.Resources.codemirror.css", AutoLoad = true)]
    public class ScriptsWebUiPlugin : PluginBase
    {
    }
}