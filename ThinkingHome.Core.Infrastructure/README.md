# ThinkingHome.Core.Infrastructure

Библиотека загружает установленные и локальные плагины, применяет настройки приложения и управляет запуском и остановкой сервисов ThinkingHome. Для запуска из командной строки используйте инструмент `ThinkingHome.Console` и команду `th run`.

Для встраивания хоста в .NET-приложение передайте каталог установки в `PluginHost.Open`, затем вызовите `Start`. Освобождение хоста останавливает плагины и освобождает снимок установки:

```csharp
using var host = ThinkingHome.Core.Infrastructure.PluginHost.Open(applicationDirectory);
host.Start();
```
