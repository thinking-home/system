*ThinkingHome.Plugins.Scripts*

# ScriptsPlugin

Позволяет сохранять в системе сценарии и выполнять их. Сценарии - небольшие программы на JavaScript, в которых доступен API плагинов. Сценарии могут быть созданы во время работы системы (без необходимости устанавливать или перезапускать что-либо).

## Данные

Ниже перечислены классы, определенные в пакете ThinkingHome.Plugins.Scripts для хранения данных о сценариях. Вы можете работать с ними с помощью плагина [DatabasePlugin](../ThinkingHome.Plugins.Database/README.md) и [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core).

### UserScript

Представляет собой сценарий, сохраненный в системе.

Таблица: `Scripts_UserScript`

Поля:

- `Guid Id` - id сценария
- `string Name` - название сценария 
- `string Body` - текст сценария

### ScriptEventHandler

Содержит информацию о подписке сценария на сценарное событие с заданным именем.

Таблица: `Scripts_EventHandler`

Поля:

- `Guid Id` - id подписки на событие
- `string EventAlias` - название события 
- `UserScript UserScript` - сценарий, который должен быть выполнен при возникновении события

## API

### object ExecuteScript(string body, params object[] args)

Запускает сценарий, текст которого задан первым параметром. Параметры, начиная со второго, передаются в качестве аргументов в запускаемый сценарий.

*Пример*

```csharp
string script = "var res = 0;" +
                "for (var i = 0; i < arguments.length; i++)" +
                "res += arguments[i];" +
                "return res;";

var result = Context.Require<ScriptsPlugin>()
    .ExecuteScript(script, 1, 2, 3, 4, 5, 6);
    
// result == 15    

```

### object ExecuteScriptByName(string name, params object[] args)

Запускает сценарий, который был ранее сохранен в системе под именем, указанным первым параметром. Параметры, начиная со второго, передаются в качестве аргументов в запускаемый сценарий. 

*Пример*

```csharp
var result = Context.Require<ScriptsPlugin>()
    .ExecuteScriptByName("switch-on", 42);

```

### void EmitScriptEvent(string eventAlias, params object[] args)

Генерирует сценарное событие с заданным именем и параметрами. Будут автоматически вызваны все обработчики (сценарии), подписанные на это событие. Вызов обработчиков происходит асинхронно.

*Пример*

```csharp
var result = Context.Require<ScriptsPlugin>()
    .EmitScriptEvent("обнаружено-движение", roomName);

```

## API сценариев


