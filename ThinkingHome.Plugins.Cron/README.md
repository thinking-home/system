*ThinkingHome.Plugins.Cron*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Cron.svg)]()

# CronPlugin

Предоставляет возможность запускать методы плагинов и сценарии автоматизации по расписанию.

## Данные

Плагин добавляет новую сущность `CronTask` для хранения информации о расписании выполнения действий. Данные о расписании хранятся в БД. Вы можете работать с ними с помощью плагина [DatabasePlugin](../ThinkingHome.Plugins.Database/README.md) и [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core).

### `ThinkingHome.Plugins.Cron.Model.CronTask`

Представляет собой одну запись в расписании.

Каждая запись содержит информацию о времени выполнения действия и может содержать название сценарного события. При наступлении нужного времени автоматически будет сгенерировано сценарное событие (если указано его название) и событие для плагинов.

Таблица: `Cron_Task`

Поля:

- `Guid Id` - id записи.
- `string Name` - название для отображения в интерфейсе (обязательно для заполнения).
- `string EventAlias` - alias сценарного события (если не указан, событие не генерируется).
- `int? Month` - номер месяца, начиная с 1 (если не указан, дествие будет выполняться каждый месяц).
- `int? Day` - номер дня месяца, начиная с 1 (если не указан, дествие будет выполняться каждый день).
- `int? Hour` - номер часа, начиная с 0 (если не указан, дествие будет выполняться каждый час).
- `int? Minute` - номер минуты, начиная с 0 (если не указан, дествие будет выполняться каждую минуту).
- `bool Enabled` - признак "запись активна".

## API

### `void ReloadTasks()`

Сбрасывает кэш расписания.

При старте приложения плагин загружает из БД информацию о расписании и кэширует её в памяти. Если нужно, чтобы осле изменения данных БД новое расписание вступило в силу, необходимо вызвать метод `ReloadTasks()`.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
   private readonly CronPlugin cron;

   private void MyMethod()
   {
      cron.ReloadTasks();
   }
}
```

### `[CronHandler]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.Cron.CronHandlerAttribute`. Метод вашего плагина будет автоматически вызываться при наступлении времени запуска каждого элемента расписания.

Сигнатура метода, вызываемого по расписанию, должна соответствовать делегату `ThinkingHome.Plugins.Cron.CronHandlerDelegate`:

```csharp
public delegate void CronHandlerDelegate(Guid cronTaskId);
```

#### Параметры:

- `Guid cronTaskId` - id запускаемого элемента расписания.

Плагины могут хранить у себя дополнительную информацию для элементов расписания и использовать её для выполнения действий.

Например, плагин "будильник" может хранить выбранную мелодию будильника и проигрывать её в нужное время.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly DatabasePlugin database;

    [CronHandler]
    public void PlayAlarm(Guid cronTaskId)
    {
        using (var db = database.OpenSession())
        {
            var alarm = db.Set<AlarmSettings>().FirstOrDefault(a => a.TaskId == cronTaskId);
    
            if (alarm != null)
            {
                PlayMusic(alarm.Music);
            }
        }
    }
}
```

## API сценариев

## Сценарные события

### `cron:task:started`

Сценарное событие `cron:task:started` генерируется при каждом запуске действия по расписанию в дополнение к сценарному событию, которое там указано. В обработчик события `cron:task:started` передаются параметры:

- `arguments[0]` - id записи расписания (`Guid`).

#### Пример обработчика

```js
var taskId = arguments[0];

host.log.info('CRON TASK STARTED: ' + taskId);
```
