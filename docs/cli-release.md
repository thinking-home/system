# Подготовка CLI и Timer к выпуску

Из корня репозитория с .NET 10 SDK соберите два архива в новый каталог (упаковщик Timer не перезаписывает пакет). Версию задаёт общий `Package.xml`. Команды ничего не отправляют в nuget.org.

```sh
dotnet pack ThinkingHome.Console/ThinkingHome.Console.csproj -c Release -o artifacts/nuget/5.0.0-alpha.1
dotnet run -c Release --project ThinkingHome.Packaging -- pack ThinkingHome.Plugins.Timer/ThinkingHome.Plugins.Timer.csproj artifacts/nuget/5.0.0-alpha.1
bash tools/cli-acceptance.sh artifacts/nuget/5.0.0-alpha.1/ThinkingHome.Console.5.0.0-alpha.1.nupkg artifacts/nuget/5.0.0-alpha.1/ThinkingHome.Plugins.Timer.5.0.0-alpha.1.nupkg
```

Сценарий запускается в Bash 4+ на Linux или в Git Bash на Windows. Нужны .NET SDK 10 с ASP.NET Core Runtime 10, Node.js, unzip и yq v4 от Mike Farah. Он устанавливает именно переданный CLI во временный `--tool-path` с пустым кешем NuGet и единственным локальным источником. Рабочий каталог находится вне checkout. Архив Timer отдаётся локальным HTTP-сервером NuGet V3. В deps.json сборки проверяется, что из компонентов ThinkingHome только Console зависит от System.CommandLine. Проверяются версия и команды инструмента, хеш установленного Timer, восстановление в другой каталог, проверка без сети, запуск и штатная остановка хоста, удаление плагина. Установка не меняет глобальные инструменты пользователя.

При выпуске GitHub Actions запускает эту приёмку на архивах CLI и Timer из полного комплекта. Порядок сборки и публикации всех пакетов описан в [инструкции по выпуску](nuget-release.md). После публикации повторите [потребительский сценарий](../ThinkingHome.Console/TOOL.md) на машине без репозитория, указав nuget.org в `sources.json`.
