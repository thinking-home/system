*ThinkingHome.Plugins.Mqtt*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Mqtt.svg)]()

# MqttPlugin

Предоставляет возможность публиковать и получать [MQTT](https://en.wikipedia.org/wiki/MQTT) сообщения.

При старте плагин подключается к MQTT брокеру, заданному в настройках и подписывается на указанные каналы. При появлении сообщений в прослушиваемых каналах плагин генерирует события.

## Конфигурация

Вы можете настраивать параметры подключения к MQTT брокеру и список каналов, в которых нужно обрабатывать сообщения.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Mqtt.MqttPlugin": {
            "host": "localhost",
            "port": 1883,
            "login": "",
            "password": "",
            "topics": ["#"]
        }
    }
}
```

## API

### `void Publish(string topic, byte[] payload, bool retain = false)`

Публикует сообщение в указанном канале.

#### Параметры

- `string topic` - название канала.
- `byte[] payload` - передаваемые данные.
- `bool retain` - признак "хранить сообщение". Если передать `true`, брокер сохранит сообщение и при следующей подписке на этот топик сразу отправит его подписчику.


#### Пример

```csharp
Context.Require<MqttPlugin>()
    .Publish("myhome/kitchen/temperature", new byte[] {12}, false);

```

### `void Publish(string topic, string payload, bool retain = false)`

Публикует сообщение в указанном канале. Работает полностью аналогично предыдущему методу, но данные передаются в виде строки. Строка с данными будет преобразована в набор байтов (кодировка UTF8).

#### Пример

```csharp
Context.Require<MqttPlugin>()
    .Publish("myhome/kitchen/temperature", "value=12", false);

```


### `void Publish(string topic, Buffer payload, bool retain = false)`

Публикует сообщение в указанном канале. Работает полностью аналогично предыдущему методу, но данные передаются в виде объекта `Buffer`. Метод для использования в сценариях.

#### Пример

```csharp
Buffer payload = ...

Context.Require<MqttPlugin>()
    .Publish("myhome/kitchen/temperature", payload, false);

```

### `[MqttMessageHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.Mqtt.MqttMessageHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при получении MQTT сообщений в одном из прослушиваемых каналов.

Сигнатура метода, вызываемого по таймеру, должна соответствовать делегату `ThinkingHome.Plugins.Mqtt.MqttMessageHandlerDelegate`:

```csharp
public delegate void MqttMessageHandlerDelegate(string topic, byte[] payload);
```

#### Параметры

- `string topic` - название канала, в который пришло сообщение.
- `byte[] payload` - полученные данные.

#### Пример

```csharp
[MqttMessageHandler]
public void HandleMqttMessage(string topic, byte[] payload)
{
    var str = Encoding.UTF8.GetString(payload);

    Logger.LogInformation($"{topic}: {str}");
}
```

## API сценариев

### `mqttPublishString`

Публикует MQTT сообщение в заданном канале. Данные для сообщения задаются строкой (будет преобразована в массив байтов, кодировка UTF8).

#### Пример

```js
host.api.mqttPublishString('myhome/kitchen/temperature', 'value=31', false);

```

### `mqttPublishBuffer`

Публикует MQTT сообщение в заданном канале. Данные для сообщения задаются объектом `Buffer`.

#### Пример

```js
var buffer = ...

host.api.mqttPublishBuffer('myhome/kitchen/temperature', buffer, false);

```

## Сценарные события

### `mqtt:message:received`

Сценарное событие `mqtt:message:received` генерируется при получени сообщения в одном из прослушиваемых каналов. В обработчик события передаются параметры:

- `arguments[0]` - название канала, в который пришло сообщение (`string`).
- `arguments[1]` - полученные данные (`Buffer`).

#### Пример обработчика

```js
var topic = arguments[0];
var text = arguments[1].ToUtf8String();

host.log.info('[MQTT MESSAGE] ' + topic + ': ' + text)
```
