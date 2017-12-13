*ThinkingHome.Core.Plugins*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Core.Plugins.svg)]()

Этот пакет содержит классы, реализующие базовые возможности плагинов.
Если вы хотите написать новый плагин, вам нужно [подключить](https://www.nuget.org/packages/ThinkingHome.Core.Plugins) этот пакет в свой проект.

## Создание нового плагина

Создайте в своем проекте новый класс, унаследованный от `ThinkingHome.Core.Plugins.PluginBase`. `PluginBase` - это абстрактный класс, который содержит общую функциональность для всех плагинов: логирование, локализация, взаимодействие  другими плагинами. Также при запуске система ищет доступные плагины по базовому классу.

Чтобы подключить сборку с плагином в систему, добавьте её название в список `assemblies` в файле appsettings.json.

### Пример плагина

```csharp
using Microsoft.Extensions.Localization;
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

Метод `StopPlugin` вызывается при остановке приложения. Здесь можно сохранить несохраненные рабочие данные плагинв и освободить занятые ресурсы.


```csharp
public virtual void StopPlugin() { ... }
```

## Взаимодействие плагинов

> SafeInvoke

## Настройки

## Локализация

## Логирование
