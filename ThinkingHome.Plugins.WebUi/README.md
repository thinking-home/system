*ThinkingHome.Plugins.WebUi*

# WebUiPlugin

Реализует инфраструктуру веб-интерфейса системы: ... 

## Конфигурация

В разделе `pages` вы можете настроить, какие страницы использовать в качестве главной страницы приложения (параметр `pages:welcome`) и страницы списка разделов приложения (параметр `pages:apps`). По умолчанию используется страница-заглушка `/webapp/dummy.js`.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.WebUi.WebUiPlugin": {
            "pages": {
                "welcome": "/webapp/dummy.js",
                "apps": "/webapp/dummy.js"
            }
        }
    }
}
```

## API

### `[JavaScriptResource]`

С помощью атрибута `ThinkingHome.Plugins.WebUi.Attributes.JavaScriptResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл JavaScript из ресурсов. Атрибутом необходимо отметить класс вашего плагина. 

В параметрах атрибута нужно указать: URL относительно корневого адреса и путь к файлу в ресурсах DLL. Также вы можете задать дополнительные параметр `Alias` - имя, по которому можно будет обращаться к файлу в [модульной системе](#Модульная-система). 

#### Пример

```csharp
[JavaScriptResource("/webui/my-page.js", "MyPlugin.Resources.my-page.js")]
public class MyPlugin : PluginBase
{

}
```

### `[CssResource]`

С помощью атрибута `ThinkingHome.Plugins.WebUi.Attributes.CssResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл CSS из ресурсов. Атрибутом необходимо отметить класс вашего плагина. 

```csharp
[CssResourceAttribute("/webui/my-page.css", "MyPlugin.Resources.my-page.css")]
public class MyPlugin : PluginBase
{

}
```

## Клиентская инфраструктура

### Стили


доступен
- font-awesome
- bootstrap

### Модульная система

### Общие модули

### Классы приложения

### Навигация 

systemjs

lib:
        common: {
            ApplicationBlock: applicationBlock,
            AppSection: appSection
        },
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        moment: moment,
        _: _,
        $: $

setContentView
navigate
