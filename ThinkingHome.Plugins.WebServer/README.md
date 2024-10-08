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

Если внутри динамического обработчика будет сгенерировано исключение, то сервер отдаст на клиент ответ с кодом 500 (внутренняя ошибка сервера). Если вы хотите отдать ответ с кодом 400 (bad request), то сгенерируйте исключение `ThinkingHome.Plugins.WebServer.Handlers.HttpHandlerException` и передайте нужный параметр `statusCode`.

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

## Клиент-серверная шина сообщений

Клиент-серверная шина сообщений (message hub) - средство для передачи данных между сервером и клиентом (например, браузером). Инициировать отправку сообщения может как клиент, так и сервер.

В начале работы плагин создает SignalR Hub по адресу [/hub](http://localhost:8080/hub). В него можно отправлять сообщения как с клиента, так и с сервера. Эти сообщения будут получены подписанными на них обработчиками на сервере и на всех клиентах, подключенных в текущий момент.

При отправке сообщения нужно указать *название канала* - строковый идентификатор. Зная его, обработчики могут подписаться на получение сообщений в этом канале.

### `Task Send(string topic, object data)`

Отправляет сообщение в указанный канал.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
   private readonly WebServerPlugin server;

   private void MyMethod()
   {
      server.Send(topic, new { msg = "Hello!", count = 42 });
   }
}
```

#### Обработка сообщений

Когда вы конфигурируете веб-сервер, вы можете назначить обработчики для сообщений, полученных через шину сообщений.

Сигнатура метода должна соответствовать делегату `ThinkingHome.Plugins.WebServer.Messages.HubMessageHandlerDelegate`:

```csharp
public delegate void HubMessageHandlerDelegate(Guid msgId, DateTime timestamp, string topic, object data);
```

#### Параметры

- `Guid msgId` - уникальный идентификатор сообщения;
- `DateTime timestamp` - дата и время получения сообщения (серверные);
- `string topic` - название канала, в который пришло сообщение;
- `object data` - полученные данные.

#### Пример

```csharp
[ConfigureWebServer]
public void RegisterHttpHandlers(WebServerConfigurationBuilder config)
{
    config.RegisterMessageHandler("my-topic", TestMessageHandler);
}

public void TestMessageHandler(Guid msgId, DateTime timestamp, string topic, object data)
{
    Logger.LogInformation("{0}:{1}:{2}:{3}", msgId, timestamp, topic, data);
}
```
