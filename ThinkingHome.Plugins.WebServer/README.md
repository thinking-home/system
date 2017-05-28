*ThinkingHome.Plugins.WebServer* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebServer.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebServer)

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

## Статические ресурсы

Статические ресурсы возвращают одинаковое содержимое при каждом запросе к ним. Статические ресурсы кэшируются на клиенте и сервере.

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

## Динамические ресурсы

Содержимое динамических ресурсов генерируется при каждом запросе к ним. За генерацию содержимого отвечают методы плагинов, отмеченные специальными атрибутами. Нужный метод будет вызван автоматически при получении HTTP запроса на URL, указанный в его атрибуте. Динамические ресурсы не кэшируются.

Сигнатура метода, обрабатывающего HTTP запрос, должна соответствовать делегату `HttpHandlerDelegate`:

```csharp
public delegate object HttpHandlerDelegate(HttpRequestParams requestParams);
```

Входной параметр `requestParams` содержит информацию о параметрах HTTP запроса. Возвращаемое из метода значение будет передано на клиент в качестве содержимого запрошенного ресурса.


### `[WebApiMethod]`

С помощью атрибута `ThinkingHome.Plugins.WebServer.Attributes.WebApiMethodAttribute` вы можете указать, что метод плагина является методом Web API и доступен для обращения по HTTP.

Результат работы метода будет сериализован в JSON и передан на клиент.

#### Пример

```csharp
[HttpCommand("/cow/add")]
public object AddCow(HttpRequestParams requestParams)
{
    var name = requestParams.GetRequiredString("name");

    // ... add new cow with specified name

    return new { success = true, message = "Cow is added." };
}
```

### `[HttpJsonDynamicResource]`

Атрибут `ThinkingHome.Plugins.WebServer.Attributes.HttpJsonDynamicResourceAttribute` позволяет обращаться к методу плагина по HTTP как к файлу JSON.

По сути атрибуты `[WebApiMethod]` и `[HttpJsonDynamicResource]` делают одно и то же - сериализуют результат метода в JSON и отправляют на клиент. Разница между ними в том, что первый для клиента выглядит как метод API (выполнение действий), а второй - как файл (получение контента). Сейчас между ними нет технических различий, но в будущем они могут появиться.  

#### Пример

```csharp
[HttpCommand("/settings.json")]
public object TmpHandlerMethod42(HttpRequestParams requestParams)
{
    return new { 
        rootDir = GetRootDir(), 
        lang = GetCurrentLang()
    };
}
```

### `[HttpTextDynamicResource]`

Атрибут `ThinkingHome.Plugins.WebServer.Attributes.HttpTextDynamicResourceAttribute` позволяет обращаться к методу плагина по HTTP как к текстовому файлу.

Результат работы метода будет преобразован в строку (`ToString()`) и отправлен на клиент с заданным content type.

#### Пример

```csharp
[HttpTextDynamicResource("/settings.css", "text/css")]
public object TmpHandlerMethod42(HttpRequestParams requestParams)
{
    return "body { color: red; }";
}
```

### `[HttpBinaryDynamicResource]`

Атрибут `ThinkingHome.Plugins.WebServer.Attributes.HttpBinaryDynamicResourceAttribute` позволяет обращаться к методу плагина по HTTP как к бинарному файлу. Например, с помощью этого метода  можно вернуть на клиент динамически сгенерированное изображение.

Результат работы метода будет приведен к типу `byte[]` (массив байтов) и отправлен на клиент с заданным content type (по умолчанию `"application/octet-stream"`).

#### Пример

```csharp
[HttpBinaryDynamicResource("/settings.css", "text/css")]
public object TmpHandlerMethod42(HttpRequestParams requestParams)
{
    var strDate = DateTime.Now.ToLongDateString();

    return Encoding.UTF8.GetBytes(strDate);
}
```


