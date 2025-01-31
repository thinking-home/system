*ThinkingHome.Plugins.Mqtt*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Mqtt.svg)]()

# MqttPlugin

Предоставляет возможность публиковать и получать [MQTT](https://en.wikipedia.org/wiki/MQTT) сообщения.

При старте плагин подключается к MQTT брокеру, заданному в настройках и подписывается на указанные каналы. При появлении сообщений в прослушиваемых каналах плагин генерирует события.

## Конфигурация

Вы можете настраивать параметры подключения к MQTT брокеру и названия сценарных событий при получении сообщений MQTT.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Mqtt.MqttPlugin": {
            "host": "localhost",
            "port": 1883,
            "login": "",
            "password": "", 
            "scriptEvents": {
                "counter/+/value": "mqtt:message:counter:changed",
                "device/#": "mqtt:message:received:status:received"
            }
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
public class MyPlugin : PluginBase
{
    private readonly MqttPlugin mqtt;
    
    private void MyMethod()
    {
        mqtt.Publish("myhome/kitchen/temperature", new byte[] {12}, false);
    }
}
```

### `void Publish(string topic, string payload, bool retain = false)`

Публикует сообщение в указанном канале. Работает полностью аналогично предыдущему методу, но данные передаются в виде строки. Строка с данными будет преобразована в набор байтов (кодировка UTF8).

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly MqttPlugin mqtt;
    
    private void MyMethod()
    {
        mqtt.Publish("myhome/kitchen/temperature", "value=12", false);
    }
}
```

### `void Publish(string topic, Buffer payload, bool retain = false)`

Публикует сообщение в указанном канале. Работает полностью аналогично предыдущему методу, но данные передаются в виде объекта `Buffer`. Метод предназначен для использования в сценариях.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly MqttPlugin mqtt;
    
    private void MyMethod()
    {
        Buffer payload = ...
        
        mqtt.Publish("myhome/kitchen/temperature", payload, false);
    }
}
```

### Подписка на сообщения

API для подписки на сообщения MQTT находится в пространстве имен `ThinkingHome.Plugins.Mqtt.DynamicConfiguration`.

Вы можете пометить метод своего плагина атрибутом `ConfigureMqttAttribute` и внутри этого метода настроить обработчики, которые будут выполняться при получении сообщений MQTT, попадающих под заданные фильтры. Сигнатура метода должна соответствовать делегату `ConfigureMqttDelegate`: метод должен принимать один параметр типа `MqttConfigurationBuilder` и не должен возвращать никакое значение.

Вы можете настроить подписку обработчиков на сообщения с помощью метода `RegisterListener` объекта `MqttConfigurationBuilder`.

#### Параметры

- `string topicFilter` — фильтр сообщений: если пришло сообщение в топик, который соответствует этому фильтру, то будет вызван заданный обработчик. В фильтре моно использовать [подстановки](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901241).
- `Action<string, byte[]> handler` — функция-обработчик сообщения, принимающая параметры: 
  - `string topic` — топик MQTT, в котором получено сообщение
  - `byte[] payload` — содержимое полученного сообщения (массив байтов)

#### Пример

```csharp
[ConfigureMqtt]
public void RegisterMqttListeners(MqttConfigurationBuilder config)
{
    // подписка на отдельный топик "counter/123/status"
    config.RegisterListener("counter/123/status", HandleMqttMessage);

    // подписка группу топиков, соответствующую шаблону, где на втором уровне
    // может быть любое значение, например: "counter/41/status", "counter/32/status"
    config.RegisterListener("counter/+/status", HandleMqttMessage);

    // подписка на все топики с префиксом "counter/"
    config.RegisterListener("counter/#", HandleMqttMessage);
}

private void HandleMqttMessage(string topic, byte[] payload)
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

В настройках плагина при помощи параметра `scriptEvents` вы можете настроить сценарные события, связанные с сообщениями MQTT.

В качестве значения параметра `scriptEvents` нужно указать объект, ключи которого содержат фильтры топиков MQTT, а значения — названия сценарных событий, которые будут генерироваться при получении сообщений MQTT, подходящих под заданные фильтры.

```js
{
    "plugins": {
        ...
        "ThinkingHome.Plugins.Mqtt.MqttPlugin": {
            ...
            "scriptEvents": {
                "counter/+/value": "mqtt:message:counter:changed",
                "device/#": "mqtt:message:received:status:received"
            }
        }
    }
}
```

В обработчик события передаются параметры:

- `arguments[0]` - название канала, в который пришло сообщение (`string`).
- `arguments[1]` - полученные данные (`Buffer`).

#### Пример обработчика

```js
var topic = arguments[0];
var text = arguments[1].ToUtf8String();

host.log.info('[MQTT MESSAGE] ' + topic + ': ' + text)
```

## Запуск сервера для отладки

```bash
# создаем конфиг, в котором разрешаем анонимное подключение
# без этого конфига анонимно можно подключиться только с localhost
echo "listener 1883\nallow_anonymous true" > mosquitto.conf

# запускаем контейнер и кладем в него конфиг
docker run --name mosquitto -it -p 1883:1883 -p 9001:9001 -v $PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto

# подписка на события (в отдельной вкладке)
docker exec -i mosquitto mosquitto_sub -t '$devices/#' -v

# отправка сообщений (в отдельной вкладке)
docker exec -i mosquitto mosquitto_pub -t '$devices/1377/events' -m '{"text":"MOO"}'
```
