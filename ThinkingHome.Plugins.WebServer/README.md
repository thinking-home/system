*ThinkingHome.Plugins.WebServer*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebServer.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.WebServer)

# WebServerPlugin

Предоставляет другим плагинам возможность обрабатывать HTTP запросы:

- выполнять методы плагинов для обработки HTTP запросов
- возвращать заданные статические ресурсы по URL

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

Вы можете пометить метод своего плагина атрибутом `ThinkingHome.Plugins.WebServer.Attributes.ConfigureWebServerAttribute` и внутри этого метода настроить, чтобы веб-сервер по заданным URL отдавал на клиент статические или динамические ресурсы. Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.WebServer.Attributes.ConfigureWebServerDelegate`: метод должен принимать один параметр типа `ThinkingHome.Plugins.WebServer.WebServerConfigurationBuilder` и не должен возвращать никакое значение. С помощью методов объекта `WebServerConfigurationBuilder` вы можете настроить, как обрабатывать запросы на различные URL.

#### Пример

```csharp
[ConfigureWebServer]
public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
{
    // настраиваем веб-сервер, вызывая методы объекта config
}
```

### Статические ресурсы

Метод `RegisterEmbeddedResource` добавляет URL, при запросе на который сервер отдает на клиент заданный файл из ресурсов DLL. Статические ресурсы кэшируются на клиенте и сервере.

#### Параметры

- `string url` — URL относительно корневого адреса
- `string resourcePath` — путь к файлу в ресурсах DLL
- `string contentType` — content type (по умолчанию "text/plain")
- `Assembly assembly` — DLL, из которой нужно брать файл ресурсов (по умолчанию — из текущей)

#### Пример

```csharp
[ConfigureWebServer]
public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
{
    config.RegisterEmbeddedResource("/favicon.ico", "MyPlugin.favicon.ico", "image/x-icon");
}
```

### Динамические ресурсы

Содержимое динамических ресурсов генерируется при каждом запросе к ним. За генерацию содержимого отвечают методы плагинов, зарегистрированные с помощью метода `RegisterDynamicResource`. Нужный метод будет вызван автоматически при получении HTTP запроса на указанный URL.

#### Параметры

- `string url` — URL относительно корневого адреса
- `HttpHandlerDelegate method` — обработчик запросов
- `bool isCached` — нужно ли кэшировать ответ (по умолчанию `false`)

#### Обработчик запросов

Сигнатура метода, обрабатывающего HTTP запрос, должна соответствовать делегату `ThinkingHome.Plugins.WebServer.HttpHandlerDelegate`:

```csharp
delegate HttpHandlerResult HttpHandlerDelegate(HttpRequestParams requestParams)
```

Входной параметр `requestParams` содержит информацию о параметрах HTTP запроса.

Метод должен возвращать экземпляр класса `HttpHandlerResult`, на основе которого будет сформирован ответ для клиента. Вы можете использовать статические методы класса `HttpHandlerResult`, чтобы вренуть результ нужного типа: `Text`, `Json`, `Binary`. Если вернуть из метода значение `null`, то на клиент уйдет ответ с пустым содержимым.

#### Пример

```csharp
[ConfigureWebServer]
public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
{
    config.RegisterDynamicResource("/api/cow/add", AddCow);
}

public HttpHandlerResult AddCow(HttpRequestParams requestParams)
{
    var name = requestParams.GetRequiredString("name");

    // ... add new cow with specified name
    
    var result = new { success = true, message = "Cow is added." };

    return HttpHandlerResult.Json(result);
}
```

### `[HttpLocalizationResource]` (неактуально)

Ресурсы локализации позволяют по заданному url отдать на клиент тексты для плагина на текущем языке. Чтобы добавить ресурс локализации пометьте класс плагина атрибутом `ThinkingHome.Plugins.WebServer.Attributes.HttpLocalizationResourceAttribute` и укажите в параметрах его конструктора нужный url. 

#### Пример

```csharp
[HttpLocalizationResource("/static/my-plugin/lang.json")]
public class MyPlugin : PluginBase
{

}
```

Ресурсы локализации кэшируются на клиенте и сервере.

## Клиент-серверная шина сообщений (неактуально)

```
TODO:
+ инициализация хаба при запуске сервера
+ метод отправки сообщений на сервере
+ метод отправки сообщений для вызова с клиента
+ логирование факта прихода сообщений на сервере
+ рассылка сообщений по клиентам
+ регистрация обработчиков сообщений в плагинах
+ вызов обработчиков сообщений в плагинах
+ отправлять конфиг signalr на клиент
- на клиенте при открытии страницы создавать подключение 
- переделать регистрацию на билдер и передавать канал как параметр
- проверить логирование
- проверить отправку с сервера и клиента + получение несколькими обработчиками на сервере и несколькими клиентами
```

Клиент-серверная шина сообщений (HUB) - средство для передачи данных между сервером и клиентом (например, браузером). Инициировать отправку сообщения может как клиент, так и сервер.

В начале работы плагин создает SignalR Hub по адресу [/hub](http://localhost:8080/hub). В него можно отправлять сообщения как с клиента, так и с сервера. Эти сообщения будут получены подписанными на них обработчиками на сервере и на всех клиентах, подключенных в текущий момент.

При отправке сообщения нужно указать *название канала* - строковый идентификатор. Зная его, обработчики могут подписаться на получение сообщений в этом канале.

### `Task Send(string topic, object data)`

Отправляет сообщение в указанный канал.

#### Пример

```csharp
var result = Context.Require<WebServerPlugin>()
    .Send("topic:name", new { query = "", answer = 42 });

```

### `[HubMessageHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.WebServer.Messages.HubMessageHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении сообщений в указанном канале.

Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.WebServer.Messages.HubMessageHandlerDelegate`:

```csharp
public delegate void HubMessageHandlerDelegate(Guid msgId, DateTime timestamp, string topic, object data);
```

#### Параметры

- `Guid msgId` - уникальный идентификатор сообщения.
- `DateTime timestamp` - дата и время получения сообщения (серверные).
- `string topic` - название канала, в который пришло сообщение.
- `object data` - полученные данные.

#### Пример

```csharp
[HubMessageHandler("topic:name")]
public void TestMessageHandler(Guid msgId, DateTime timestamp, string topic, object data)
{
    Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, topic, data);
}
```
