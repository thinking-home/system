*ThinkingHome.Plugins.WebServer*

# WebServerPlugin

Предоставляет другим плагинам возможность обрабатывать HTTP запросы:

- выполнять методы плагинов для обработки HTTP запросов
- возвращать заданные ресурсы по URL

## Конфигурация

Вы можете настроить порт, на котором будут слушаться HTTP запросы. Для этого укажите параметр `port` в настройках плагина в файле appsettings.json.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.WebServer.WebServerPlugin": {
            "port": 8080
        }
    }
}
```

## API

### `[HttpCommand]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.WebServer.Attributes.HttpCommandAttribute` и указать в его параметрах URL. Метод вашего плагина будет автоматически вызван при получении HTTP запроса к указанному URL.

Сигнатура метода, обрабатывающего HTTP запрос, должна соответствовать делегату `HttpHandlerDelegate`:

```csharp
public delegate object HttpHandlerDelegate(HttpRequestParams requestParams);
```

Входной параметр `requestParams` содержит информацию о параметрах HTTP запроса. Возвращаемое из метода значение будет сериализовано в JSON и передано обратно на клиент.

#### Пример

```csharp
[HttpCommand("/questions/main")]
public object TmpHandlerMethod42(HttpRequestParams requestParams)
{
    return new { answer = 42 };
}
```

### `[HttpEmbeddedResource]`

С помощью атрибута `ThinkingHome.Plugins.WebServer.Attributes.HttpEmbeddedResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл ресурсов.

Атрибутом необходимо отметить класс вашего плагина. В параметрах атрибута нужно указать: URL относительно корневого адреса, путь к файлу в ресурсах DLL (файл ресурсов и плагин должны находиться в одной DLL) и content type.

#### Пример

```csharp
[HttpEmbeddedResource("/favicon.ico", "MyPlugin.favicon.ico", "image/x-icon")]
public class MyPlugin : PluginBase
{

}
```
