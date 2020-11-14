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

## HTTP-ресурсы

### `[HttpEmbeddedResource]`

С помощью атрибута `ThinkingHome.Plugins.WebServer.Attributes.HttpEmbeddedResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл ресурсов.

Атрибутом необходимо отметить класс вашего плагина. В параметрах атрибута нужно указать: URL относительно корневого адреса, content type и путь к файлу в ресурсах DLL (файл ресурсов и плагин должны находиться в одной DLL).

#### Пример

```csharp
[HttpEmbeddedResource("/favicon.ico", "MyPlugin.favicon.ico", "image/x-icon")]
public class MyPlugin : PluginBase
{

}
```

Статические ресурсы кэшируются на клиенте и сервере.

### `[HttpDynamicResource]`

Содержимое динамических ресурсов генерируется при каждом запросе к ним. За генерацию содержимого отвечают методы плагинов, отмеченные атрибутом `ThinkingHome.Plugins.WebServer.Attributes.HttpDynamicResourceAttribute`. Нужный метод будет вызван автоматически при получении HTTP запроса на URL, указанный в параметрах атрибута.

Сигнатура метода, обрабатывающего HTTP запрос, должна соответствовать делегату `ThinkingHome.Plugins.WebServer.HttpHandlerDelegate`:

```csharp
public delegate HttpHandlerResult HttpHandlerDelegate(HttpRequestParams requestParams);
```

Входной параметр `requestParams` содержит информацию о параметрах HTTP запроса.

Метод должен возвращать экземпляр класса `HttpHandlerResult`, на основе которого будет сформирован ответ для клиента. Вы можете использовать статические методы класса `HttpHandlerResult`, чтобы вренуть результ нужного типа: `Text`, `Json`, `Binary`. Если вернуть из метода значение `null`, то на клиент уйдет ответ с пустым содержимым.

#### Пример

```csharp
[HttpDynamicResource("/api/cow/add")]
public HttpHandlerResult AddCow(HttpRequestParams requestParams)
{
    var name = requestParams.GetRequiredString("name");

    // ... add new cow with specified name
    
    var result = new { success = true, message = "Cow is added." };

    return HttpHandlerResult.Json(result);
}
```

Динамические ресурсы по умолчанию не кэшируются. Чтобы включить кэширование результатов метода, передайте `true` в качестве второго аргумента для атрибута `[HttpDynamicResource]`.

#### Пример

```csharp
[HttpDynamicResource("/dynamic/cached/resource", true)]
public HttpHandlerResult GetMyCachedResource(HttpRequestParams requestParams)
{
    // ...
}
```

### `[HttpLocalizationResource]`

Ресурсы локализации позволяют по заданному url отдать на клиент тексты для плагина на текущем языке. Чтобы добавить ресурс локализации пометьте класс плагина атрибутом `ThinkingHome.Plugins.WebServer.Attributes.HttpLocalizationResourceAttribute` и укажите в параметрах его конструктора нужный url. 

#### Пример

```csharp
[HttpLocalizationResource("/static/my-plugin/lang.json")]
public class MyPlugin : PluginBase
{

}
```

Ресурсы локализации кэшируются на клиенте и сервере.

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

#### Параметры

- `Guid msgId` - уникальный идентификатор сообщения.
- `DateTime timestamp` - дата и время получения сообщения (серверные).
- `string channel` - название канала, в который пришло сообщение.
- `object data` - полученные данные.

#### Пример

```csharp
[HubMessageHandler("channel:name")]
public void TestMessageHandler(Guid msgId, DateTime timestamp, string channel, object data)
{
    Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, channel, data);
}
```
