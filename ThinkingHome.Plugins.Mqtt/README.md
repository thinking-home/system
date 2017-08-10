*ThinkingHome.Plugins.Mqtt* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Mqtt.svg)]()

# MqttPlugin

... назначение ...

## Конфигурация

... вводный текст ...


```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.Mail.MqttPlugin": {
            ...
        }
    }
}
```

## API

### `void Method(...)`

... описание ...

#### Пример

```csharp
Context.Require<MqttPlugin>()
    .Method(...);

```

### `[Event]`

... описание события ...

Вы можете отметить методы своего плагина атрибутом `EventAttribute`. Метод вашего плагина будет автоматически вызываться при ... .

Сигнатура метода, вызываемого по таймеру, должна соответствовать делегату `EventDelegate`:

```csharp
public delegate void EventDelegate(...);
```

*Параметры:*

- `string ...` - описание.
- `byte[] ...` - описание.

*Пример:*

```csharp
[Event]
public void MyEventHandler(...)
{
    ...
}
```

## API сценариев

### methodName

... описание ...

#### Пример

```js
host.api.methodName(...);

```

## Сценарные события

...
