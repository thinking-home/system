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
        Logger.LogInformation($"my plugin: init");
    }
}
```

Чтобы подключить сборку с плагином в систему, добавьте её название в список `assemblies` в файле appsettings.json.
При старте система автоматически найдет все доступные плагины внутри перечисленных сборок и создает экземпляр каждого из них.

## Жизненный цикл плагина

В базовом классе `PluginBase` описаны виртуальные методы `InitPlugin`, `StartPlugin` и `StopPlugin`.
Они автоматически вызываются на нужном этапе работы плагина. Вы можете переопределить их и добавить туда собственную логику.

### Инициализация

Метод `InitPlugin` вызывается у каждого плагина при старте приложения. Это подходящее место, чтобы задать начальное состояние плагина.

Обращаясь из метода `InitPlugin` к другим плагинам, помните, что в этот момент они еще не проинициализированы.


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

Каждый плагин может обращаться к экземплярам других плагинов, вызывать их методы и подписываться на их события. 
В базовом классе `PluginBase` описано свойство `Context`, с помощью которго можно получить экземпляр заданного плагина или список всех имеющихся плагинов.

```csharp
public IServiceContext Context { get; set; }
``` 

### Получение экземпляра конкретного плагина

```csharp
OtherPlugin plugin = Context.Require<OtherPlugin>();

plugin.ExecuteSomeMethod();
```

### Получение списка всех плагинов

```csharp
foreach (PluginBase plugin in Context.GetAllPlugins())
{
    var pluginTypeName = plugin.GetType().FullName;
    
    Logger.LogInformation(pluginTypeName);
}
```


> SafeInvoke

## Настройки

## Локализация

## Логирование
