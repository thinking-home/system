*ThinkingHome.Plugins.WebServer*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebServer.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebServer)

# WebServerPlugin

Предоставляет другим плагинам возможность обрабатывать HTTP запросы:

- выполнять методы плагинов для обработки HTTP запросов
- возвращать заданные ресурсы по URL

Также предоставляет клиент-серверную шину сообщений - средство для передачи данных между сервером и клиентом (например, браузером).

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

## Собственные типы ресурсов

Вы можете реализовать поддержку собственных типов статических и динамических ресурсов.

Например, вы можете описать тип статических ресурсов, получающий содержимое из файловой системы (или из любого другого источника). Также вы можете описать собственный тип динамических ресурсов для сериализации результатов работы методов плагинов в нужный формат (например, в XML).

### `HttpStaticResourceAttribute`

Чтобы описать атрибут для собственного типа статических ресурсов, необходимо создать класс, унаследованнй от абстрактного класса `ThinkingHome.Plugins.WebServer.Attributes.Base.HttpStaticResourceAttribute` и реализовать в нем метод `public abstract byte[] GetContent(Assembly assembly)`.

В качестве входного параметра в метод приходит информация о сборке, в которой находится плагин, помеченный атрибутом. В качестве результата необходимо вернуть массив байтов, содержащий нужный контент.

#### Пример

```csharp
public class HttpFileSystemResourceAttribute : HttpStaticResourceAttribute
{
    public string Path { get; }

    public HttpFileSystemResourceAttribute(string url, string path, string contentType = "text/plain")
        :base(url, contentType)
    {
        Path = resourcePath;
    }

    public override byte[] GetContent(Assembly assembly)
    {
        return File.ReadAllBytes(Path);
    }
}
```

### `HttpDynamicResourceAttribute`

Чтобы описать собственный тип динамических ресурсов, создайте класс, унаследованный от абстрактного класса `ThinkingHome.Plugins.WebServer.Attributes.Base.HttpDynamicResourceAttribute` и реализуйте в нем метод `public byte[] PrepareResult(object methodResult)`.

Теперь вы можете отметить этим атрибутом методы плагинов, сигнатура которых соответствует делегату `HttpHandlerDelegate` и эти методы будут автоматически вызваны при поступлении HTTP запроса на адрес, заданный в параметрах атрибута. Результат работы выванного метода будет передан в метод `PrepareResult`, который должен вернуть массив байтов, которые будут отправлены на клиент.

#### Пример

```csharp
public class HttpBinaryDynamicResourceAttribute : HttpDynamicResourceAttribute
{
    public HttpBinaryDynamicResourceAttribute(string url, string contentType = "application/octet-stream")
        :base(url, contentType)
    {
    }

    public override byte[] PrepareResult(object methodResult)
    {
        return methodResult as byte[];
    }
}
```

## Клиент-серверная шина сообщений

Клиент-серверная шина сообщений (HUB) - средство для передачи данных между сервером и клиентом (например, браузером). Инициировать отправку сообщения может как клиент, так и сервер.

В начале работы плагин создает SignalR Hub по адресу [/hub](http://localhost:8080/hub). В него можно отправлять сообщения как с клиента, так и с сервера. Эти сообщения будут получены подписанными на них обработчиками на сервере и на всех клиентах, подключенных в текущий момент.

При отправке сообщения нужно указать *название канала* - строковый идентификатор. Зная его, обработчики могут подписаться на получение сообщений в этом канале.

### `Task Send(string channel, object data)`

Отправляет сообщение в указанный канал.

#### Пример

```csharp
var result = Context.Require<WebServerPlugin>()
    .Send("channel:name", new { query = "", answer = 42 });

```

### `[HubMessageHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.WebServer.Messages.HubMessageHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении сообщений в указанном канале.

Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.WebServer.Messages.HubMessageHandlerDelegate`:

```csharp
public delegate void HubMessageHandlerDelegate(Guid msgId, DateTime timestamp, string channel, object data);
```

*Параметры:*

- `Guid msgId` - уникальный идентификатор сообщения.
- `DateTime timestamp` - дата и время получения сообщения (серверные).
- `string channel` - название канала, в который пришло сообщение.
- `object data` - полученные данные.

*Пример:*

```csharp
[HubMessageHandler("channel:name")]
public void TestMessageHandler(Guid msgId, DateTime timestamp, string channel, object data)
{
    Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, channel, data);
}
```
