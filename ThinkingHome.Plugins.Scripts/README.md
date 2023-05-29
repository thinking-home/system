*ThinkingHome.Plugins.Scripts*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.Scripts.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.Scripts)

# ScriptsPlugin

Позволяет сохранять в системе сценарии и выполнять их. Сценарии - небольшие программы на JavaScript, в которых доступен API плагинов. Сценарии могут быть созданы во время работы системы (без необходимости устанавливать или перезапускать что-либо).

## Данные

Ниже перечислены классы, определенные в пакете ThinkingHome.Plugins.Scripts для хранения данных о сценариях. Вы можете работать с ними с помощью плагина [DatabasePlugin](../ThinkingHome.Plugins.Database/README.md) и [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core).

### `ThinkingHome.Plugins.Scripts.Model.UserScript`

Представляет собой сценарий, сохраненный в системе.

Таблица: `Scripts_UserScript`

Поля:

- `Guid Id` - id сценария
- `string Name` - название сценария 
- `string Body` - текст сценария

### `ThinkingHome.Plugins.Scripts.Model.ScriptEventHandler`

Содержит информацию о подписке сценария на сценарное событие с заданным именем.

Таблица: `Scripts_EventHandler`

Поля:

- `Guid Id` - id подписки на событие
- `string EventAlias` - название события 
- `UserScript UserScript` - сценарий, который должен быть выполнен при возникновении события

## API

### `object ExecuteScript(string body, params object[] args)`

Запускает сценарий, текст которого задан первым параметром. Параметры, начиная со второго, передаются в качестве аргументов в запускаемый сценарий.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly ScriptsPlugin scripts;
    
    private void MyMethod()
    {
        string script = "var res = 0;" +
            "for (var i = 0; i < arguments.length; i++)" +
            "res += arguments[i];" +
            "return res;";

        scripts.ExecuteScript(script, 1, 2, 3, 4, 5, 6);
        
        // result == 15  
    }
}
```

### `object ExecuteScriptByName(string name, params object[] args)`

Запускает сценарий, который был ранее сохранен в системе под именем, указанным первым параметром. Параметры, начиная со второго, передаются в качестве аргументов в запускаемый сценарий. 

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly ScriptsPlugin scripts;
    
    private void MyMethod()
    {
        scripts.ExecuteScriptByName("switch-on", 42);
    }
}
```

### `void EmitScriptEvent(string eventAlias, params object[] args)`

Генерирует сценарное событие с заданным именем и параметрами. Будут автоматически вызваны все обработчики (сценарии), подписанные на это событие. Вызов обработчиков происходит асинхронно.

#### Пример

```csharp
public class MyPlugin : PluginBase
{
    private readonly ScriptsPlugin scripts;
    
    private void MyMethod(string roomName)
    {
        scripts.EmitScriptEvent("обнаружено-движение", roomName);
    }
}
```

### `[ScriptCommand]`

Вы можете отметить методы своего плагина атрибутом `ThinkingHome.Plugins.Scripts.Attributes.ScriptCommandAttribute` и они станут доступны для вызова из сценариев.

В параметрах атрибута необходимо указать имя, по которому можно будет обращаться из сценария к указанному методу.

Результат работы метода будет передан в сценарий, вызвавший его.

#### Пример

```csharp
[ScriptCommand("мукнуть")]
public int SayMoo(int count)
{
    for (var i = 0; i < count; i++)
    {
        Logger.LogInformation("Му!");
    }

    return 2459 + count;
}
```

## API сценариев

### Аргументы и возвращаемые значения

При запуске сценария (как из другого сценария, так и из кода плагинов) ему могут быть переданы аргументы. В каждом сценарии доступен объект `arguments`, содержащий значения переданных аргументов (аналогично переменной `arguments` в функциях JavaScript).

Также вы можете написать в коде сценария конструкцию `return <возвращаемое значение>;`. После исполнения этой команды выполнение сценария будет закончено, а указанное значение будет передано тому, кто запустил выполнение сценария (в качестве результата работы сценария). 

#### Пример

```js
// считаем сумму переданных аргументов
var res = 0;

for (var i = 0; i < arguments.length; i++) {
    res += arguments[i];
}

return res;
```

### Логирование

Внутри сценариев доступен объект `host.log`, предоставляющий набор методов для логирования: `trace`, `debug`, `info`, `warn`, `error`, `fatal`.

Каждый метод принимает первым параметром сообщение, которое нужно записать в лог, а в качестве остальных параметров можно передать дополнительные аргументы для сообщения. 

Сообщения записываются в лог плагина `ScriptsPlugin` с соответствующим уровнем.

#### Пример

```js
host.log.info('execute script {0}', name);
```

### Методы плагинов

Вы можете вызывать из сценариев методв плагинов, к которым плагины разрешили доступ из сценариев с помощью атрибута [ScriptCommand](#scriptcommand).

Методы плагинов доступны через объект `host.api` под именами, заданными в параметре атрибута `[ScriptCommand]`.

#### Пример

```js
var result = host.api.мукнуть(15); // result === 2474
```

### Запуск других сценариев

Вы также можете запускать из сценариев другие сценарии, обращаясь к ним через объект `host.scripts` по имени, под которым они сохранены в системе.

#### Пример

```js
var result1 = host.scripts.wakeup();
// или
var result2 = host.scripts['покормить кота'](2);
```

### Сценарные события

С помощью метода `host.emit` вы можете генерирвать сценарные события. При возникновении сценарного события будут автоматически выполнены все сценарии, подписанные на него.

Первым аргументом передается название события. Вторым и последующими аргументами можно передать дополнительные данные для обработчиков события.

#### Пример

```js
host.emit('я дома', 35, 4, 'строка текста');
```

### Работа с бинарными данными

Иногда в сценариях нужно работать с бинарными данными. При этом, если передать в сценарий из managed кода массив байтов, то он будет скорвертирован в массив вещественных чисел.

Для работы с бинарными данными используйте специальный класс-обертку `ThinkingHome.Plugins.Scripts.Buffer`. Байты хранятся в его внутреннем поле и тип данных не будет изменен при передаче в сценарии. 

#### Использование

```csharp
public class MyPlugin : PluginBase
{
    private readonly ScriptsPlugin scripts;
    
    private void MyMethod()
    {
        var bytes = ...
        var buffer = new Buffer(bytes);
        
        scripts.EmitScriptEvent("my-event", buffer");
    }
}
```

Класс `Buffer` имеет методы для получения находящихся в нем данных в виде массива чисел и в виде строк UTF8 и Base64.

```js
var buffer = arguments[0]; 

// Array<Number>
var bytes = buffer.GetBytes();  
host.log.warn('BYTES: {0}', bytes.join());

// string
host.log.warn('UTF8: {0}', buffer.ToUtf8String());
host.log.warn('BASE64: {0}', buffer.ToBase64String());
```

