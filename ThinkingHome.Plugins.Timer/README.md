*ThinkingHome.Plugins.Timer*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Timer.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.Timer)

# TimerPlugin

Предоставляет API для периодического выполнения действий по таймеру.

## API

### `[TimerCallback]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.Timer.TimerCallbackAttribute` и указать в его параметрах интервал. Метод вашего плагина будет автоматически вызываться через указанные интервалы времени.

Сигнатура метода, вызываемого по таймеру, должна соответствовать делегату `TimerCallbackDelegate`:

```csharp
public delegate void TimerCallbackDelegate(DateTime now);
```

#### Параметры

- `int interval` - интервал в милисекундах между вызовами метода.
- `int delay` - задержка в милисекундах перед первым вызовом метода (не обязательный). Если параметр `delay` не указан, будет использоваться случайное значение, не превышающее `interval` (для того, чтобы все таймеры не срабатывали одновременно при старте приложения).

#### Пример

```csharp
[TimerCallback(30000)]
public void MyTimerHandler(DateTime now)
{
    Logger.LogInformation(now);
}
```
