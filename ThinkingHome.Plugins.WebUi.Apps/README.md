*ThinkingHome.Plugins.WebUi.Apps*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebUi.Apps.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebUi.Apps)

# WebUiAppsPlugin

Организует навигацию по разделам веб-интерфейса.

Этот плагин добавляет две страницы со списками разделов веб-интерфейса.
 
| Англ.  | Рус. | URL  |
| ------ | ---- | ---- |
| Applications | Приложения | /static/web-ui/apps/common.js |
| Settings | Настройки | /static/web-ui/apps/system.js |
 
## API

### `[AppSection]`
 
Специальный атрибут `ThinkingHome.Plugins.WebUi.Apps.AppSectionAttribute`, унаследован от
`ThinkingHome.Plugins.WebUi.Attributes.JavaScriptResourceAttribute`. Как и `[JavaScriptResource]`,
он настраивает доступ с клиента к JavaScript файлам в ресурсах плагина. Кроме того, файлы, для которых
указан атрибут `[AppSection]`, автоматически добавляются на страницы со списками разделов.

#### Параметры

- `SectionType type` - тип раздела: общий (`SectionType.Common`) или системный (`SectionType.System`). Определяет, в какой список он будет добавлен.
- `string title` - название раздела для отображения в интерфейсе. Если в файле с переводами плагина есть ключ, который совпадает с названием раздела, то вместо названия будет автоматически подставлен этот перевод.
- `string url` - URL, по которому файл будет доступен на клиенте. Этот параметр аналогичен параметру `url` атрибута `[JavaScriptResource]`.
- `string resourcePath` - путь к файлу в ресурсах плагина. Этот параметр аналогичен параметру `resourcePath` атрибута `[JavaScriptResource]`.

Дополнительно можно задать необязательные параметры:

- `string Icon` - иконка для раздела - название класса [fontawesome 4.7](http://fontawesome.io) без префикса `fa-`.
- `int SortOrder` - задает порядок отображения разделов в списке.

#### Пример

```csharp
[AppSection(SectionType.System, "My page", "/webui/my-page.js", "MyPlugin.Resources.my-page.js", Icon = "clock-o")]
public class MyPlugin : PluginBase
{

}
```
