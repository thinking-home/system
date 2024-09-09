*ThinkingHome.Core.Plugins*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Core.Plugins.svg)]()

Этот пакет содержит классы, реализующие базовые возможности плагинов.
Если вы хотите написать новый плагин, вам нужно [подключить](https://www.nuget.org/packages/ThinkingHome.Core.Plugins) этот пакет в свой проект.

## Создание нового плагина

Создайте в своем проекте новый класс, унаследованный от `ThinkingHome.Core.Plugins.PluginBase`. `PluginBase` - это абстрактный класс, который содержит общую функциональность для всех плагинов: логирование, настройки, локализация, взаимодействие с другими плагинами.

```csharp
using Microsoft.Extensions.Logging;
using ThinkingHome.Core.Plugins;
...

public class MyPlugin : PluginBase
{
    public override void InitPlugin()
    {
        Logger.LogInformation("my plugin: init");
    }
}
```

Чтобы подключить сборку с плагином в систему, добавьте её название в список `assemblies` в файле [appsettings.json](#Настройки).
При старте система автоматически найдет все доступные плагины внутри перечисленных сборок и создаст экземпляр каждого из них.

## Жизненный цикл плагина

В базовом классе `PluginBase` описаны виртуальные методы `InitPlugin`, `StartPlugin` и `StopPlugin`.
Они будут вызваны автоматически на нужных этапах работы плагина. Вы можете переопределить их и добавить туда собственную логику.

### Инициализация

Метод `InitPlugin` вызывается у каждого плагина при старте приложения. Это подходящее место, чтобы задать начальное состояние плагина.

```csharp
public virtual void InitPlugin() { ... }
```

### Запуск

Метод `StartPlugin` вызывается когда все плагины проинициализированы. Здесь можно подписаться на события других плагинов или запустить нужные дочерние потоки.


```csharp
public virtual void StartPlugin() { ... }
```

### Остановка

Метод `StopPlugin` вызывается при остановке приложения. Здесь можно сохранить несохраненные рабочие данные и освободить занятые ресурсы.


```csharp
public virtual void StopPlugin() { ... }
```

## Взаимодействие плагинов

Каждый плагин может обращаться к экземплярам других плагинов, вызывать их открытые (public) методы и подписываться на события. 

Чтобы в своем плагине получить доступ к экземпляру другого плагина, укажите его в списке параметров конструктора.

```csharp
public class MyPlugin : PluginBase
{
    private readonly OtherPlugin otherPlugin;

    public PluginBase(OtherPlugin otherPlugin) {
        // сохраняем полученный экземпляр плагина в поле своего плагина 
        this.otherPlugin = otherPlugin;
    }

    public override void InitPlugin()
    {
        otherPlugin.ExecuteSomeMethod();
    }
}
```

Также поддерживаются параметры [первичного конструктора](https://learn.microsoft.com/ru-ru/dotnet/csharp/whats-new/tutorials/primary-constructors).

```csharp
public class MyPlugin(OtherPlugin otherPlugin) : PluginBase
{
    public override void InitPlugin()
    {
        otherPlugin.ExecuteSomeMethod();
    }
}
```


### Подписка на события плагинов

Плагины могут подписываться на события друг друга. Например, плагин "будильник" может подписаться на событие
"срабатывание таймера" плагина "таймер" и, если наступило нужное время, подать звуковой сигнал.

Плагин, который генерирует событие, в начале своей работы должен найти и запомнить все доступные обработчики этого события - методы других плагинов. 

Чтобы отметить метод плагина как обработчик события, удобно использовать атрибуты. С помошью атрибута можно задать
дополнительные параметры для обработчика события.

Чтобы плагин, генерирующий событие, мог легко найти методы других плагинов, отмеченных заданным атрибутом, 
он может использовать метод расширения `FindMethods`, для класса `PluginBase`.
 
```csharp
(TAttr Meta, TDelegate Method)[] FindMethods<TAttr, TDelegate>(this PluginBase plugin)
``` 
 
В метод `FindMethods` нужно передать тип атрибута, который нужно найти, и делегат, определяющий сигнатуру методов.
На выходе вы получите массив, каждый элемент которого имеет поля:  
 
- `Method` – ссылка на найденный обработчик события, отмеченный атрибутом
- `Meta` – атрибут, которым отмечен обработчик события 

#### Пример

```csharp
// плагин, который обрабатывает событие
public class Plugin1: PluginBase
{
    [MyAttribute]
    public void OnMyEvent()
    {
        // обработка события
    }
}

// плагин, который генерирует событие
public class Plugin2: PluginBase
{
    private Action[] handlers;

    // инициализация
    public override void InitPlugin()
    {
        // ищем все обработчики и запоминаем в поле плагина
        handlers = Context.GetAllPlugins()                          // получаем список плагинов
            .SelectMany(p => p.FindMethods<MyAttribute, Action>())  // ищем все обработчики во всех плагинах
            .Select(obj => obj.Method)                              // достаем метод из поля Method
            .ToArray();
    }
    
    public void TestMethod()
    {
        // когда нужно сгенерировать событие,
        // вызываем найденные обработчики
        foreach(var handler in handlers)
        {
            handler();
        } 
    }
}
```

### Безопасный вызов обработчиков

Внутри обработчика события может произойти ошибка и, если плагин корректно её не обработает, его работа прервется и все последующие обработчики не будут выполнены.

Для безопасного вызова обработчиков событий в базовом классе плагина есть метод `SafeInvoke`. В нем есть проверка обработчика на равенство `null`
и обработка исключений с записью в лог информации о них.  


```csharp
SafeInvoke(handlers, h => h(task.TaskId), true);
```

Параметры:

1. Обработчик события (делегат) или коллекция обработчиков. 
1. Действие, которое нужно выполнить для каждого обработчика (например, вызвать его с заданными аргументами). 

Для асинхронного параллельного выполнения обработчиков используйте метод `SafeInvokeAsync` с аналогичными параметрами.

## Логирование

Плагинам доступны инструменты для логирования (используется пакет [Microsoft.Extensions.Logging](https://www.nuget.org/packages/Microsoft.Extensions.Logging/)).

В базовом классе `PluginBase` есть свойство `Logger` (`Microsoft.Extensions.Logging.ILogger`). Используйте его методы для записи в лог.

```csharp
using Microsoft.Extensions.Logging;

public class MyPlugin: PluginBase
{
    public override void InitPlugin()
    {
        Logger.LogInformation("Hello world!");
    }
}
```

Для записи логируемой информации в конкретное место назначения (в консоль, файл, базу данных и др.) 
используется библиотека [Serilog](https://serilog.net). Её параметры находятся в файле с настройками 
системы [appsettings.json](#Настройки). По умолчанию настроен вывод информации в консоль и сохранение
в текстовый файл в папке `logs` (отдельный файл для каждого плагина). Узнать подробнее о настройках библиотеки Serilog вы можете 
в [документации](https://github.com/serilog/serilog-settings-configuration).

## Локализация

В систему уже встроены инструменты для работы со строками на нескольких языках. Вы можете разместить переводы для строк 
в ресурсах плагина (*EmbeddedResource*) и во время его работы он автоматически получит строки на нужном языке. Язык выбирается в [настройках приложения](#Настройки).
Все стандартные плагины поддерживают два языка: русский и английский. 

### Файлы языковых ресурсов

Для хранения текстов на нескольких языках создайте в корне проекта папку `Lang` и добавьте в нее
файлы ресурсов (.resx). Для каджого плагина создайте один *главный* `.resx` файл (для текстов на английском языке)
и по одному файлу для каждого дополнительного языка (например, для русского).

Названия файлов должны совпадать с названием плагина. Файлы для дополнительных языков должный иметь суффикс, 
соответствующий [коду их языка](http://www.csharp-examples.net/culture-names). 

```
├─ Lang
│  ├─ MyPlugin.resx        // тексты на английском
│  ├─ MyPlugin.ru-RU.resx  // тексты на русском
│  └─ MyPlugin.uk-UA.resx  // тексты на украинском
└─ MyPlugin.cs
```

Каждый файл `.resx` хранит набор пар ключ-значение: значение – это текст на нужном языке, а ключ – идентификатор, 
по которому можно ссылаться на этот текст в коде.

```xml
<?xml version="1.0" encoding="utf-8"?>
<root>
    <data name="hello" xml:space="preserve">
        <value>Hello!</value>
    </data>
    <data name="bye" xml:space="preserve">
        <value>Bye!</value>
    </data>
    ...
</root>
```

### Использование переводов

Для работы с переводами в каждом плагине доступно свойство `StringLocalizer`. Объект, который в нем находится, реализует
интерфейс `IStringLocalizer` из пакета [Microsoft.Extensions.Localization](https://www.nuget.org/packages/Microsoft.Extensions.Localization).
Чтобы получить перевод для заданного ключа, вызовите метод `GetString` или обратитесь по индексу.

```csharp
// результат выполнения этих строк - одинаков
var translation1 = StringLocalizer.GetString("hello");
var translation2 = StringLocalizer["hello"];
```

Чтобы получить список всех переводов плагина, используйте метод `GetAllStrings`.

```csharp
foreach (LocalizedString str in StringLocalizer.GetAllStrings())
{
    Logger.LogInformation($"{str.Name}: {str.Value} ({str.SearchedLocation})");
}
```

## Настройки

Все настройки системы хранятся в конфигурационном файле `appsettings.json`, который находится в корневой папке приложения.

```js
{
    "culture": "ru-RU", 
    "assemblies": [ ... ],
    "Serilog": { ... },
    "plugins": { 
        "Namespace1.Plugin1": { ... },
        "Namespace2.Plugin2": { ... }
     }
}
```

- Поле `culture` (строка) задает [используемый язык](http://www.csharp-examples.net/culture-names).
- Поле `assemblies` (массив строк) задает список сборок, в которых нужно искать доступные плагины при старте приложения. 
- Раздел `Serilog` (объект) задает настройки логирования. Описание параметров смотрите в [документации](https://github.com/serilog/serilog-settings-configuration) библиотеки Serilog.
- Раздел `plugins` (объект) содержит настройки плагинов.

[Пример](../ThinkingHome.Console/appsettings.json)

### Настройки плагинов

Выше было сказано, что настройки плагинов хранятся в разделе `plugins`. Каждый ключ раздела - это название класса плагина, включая пространство имен.
Значение для каждого ключа - это параметры плагина. Названия параметров смотрите в описаниях плагинов.

В каждом плагине доступно поле `Configuration`, определенное в базовом классе `PluginBase`. Его значение реализует интерфейс
`IConfigurationSection` из пакета [Microsoft.Extensions.Configuration](https://www.nuget.org/packages/Microsoft.Extensions.Configuration).  
Через него плагин может получить значения своих настроек.

```csharp
public class MyPlugin: PluginBase
{
    public override void InitPlugin()
    {
        string myParameter = Configuration["parameterName"];
        
        // ...
    }
}
```
