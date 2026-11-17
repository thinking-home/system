# Подготовка CLI и Timer к выпуску

Из корня репозитория с .NET 10 SDK соберите два архива в новый каталог (упаковщик Timer не перезаписывает пакет). Версию задаёт общий `Package.xml`. Команды ничего не отправляют в nuget.org.

```sh
dotnet pack ThinkingHome.Console/ThinkingHome.Console.csproj -c Release -o artifacts/nuget/5.0.0-alpha.1
dotnet run -c Release --project ThinkingHome.Packaging -- pack ThinkingHome.Plugins.Timer/ThinkingHome.Plugins.Timer.csproj artifacts/nuget/5.0.0-alpha.1
python tools/cli-acceptance.py artifacts/nuget/5.0.0-alpha.1/ThinkingHome.Console.5.0.0-alpha.1.nupkg artifacts/nuget/5.0.0-alpha.1/ThinkingHome.Plugins.Timer.5.0.0-alpha.1.nupkg
```

Сценарий требует Python 3.10+ и .NET SDK 10 с ASP.NET Core Runtime 10. Он устанавливает именно переданный CLI во временный `--tool-path` с пустым кешем NuGet и единственным локальным источником. Рабочий каталог находится вне checkout. Архив Timer отдаётся локальным HTTP-сервером NuGet V3. В deps.json сборки проверяется, что из компонентов ThinkingHome только Console зависит от System.CommandLine. Проверяются версия и команды инструмента, хеш установленного Timer, восстановление в другой каталог, проверка без сети, запуск и штатная остановка хоста, удаление плагина. Установка не меняет глобальные инструменты пользователя.

Для выпуска используются **те же два проверенных архива**. Ядро для выполнения Timer уже входит в CLI; отдельный пакет ядра понадобится разработчикам для компиляции сторонних плагинов через PackageReference. После публикации обоих архивов повторите [потребительский сценарий](../ThinkingHome.Console/TOOL.md) на машине без репозитория, указав nuget.org в `sources.json`.
