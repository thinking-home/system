# ThinkingHome CLI

Хост и менеджер плагинов ThinkingHome поставляются одним инструментом для .NET 10.
Для установки нужен .NET SDK 10 с ASP.NET Core Runtime 10, Windows x64 или Linux x64 (glibc).

```sh
dotnet tool install --global ThinkingHome.Console --version 5.0.0-alpha.1
th --version
th --help
```

Создайте `sources.json` с адресом репозитория, в котором опубликован Timer:

```json
{"sources":["https://api.nuget.org/v3/index.json"]}
```

```sh
th install ./home ThinkingHome.Plugins.Timer "[5.0.0-alpha.1]" ./sources.json
th run --app ./home --check
th run --app ./home
```

`--check` проверяет установку без запуска плагинов. Обычный запуск останавливается по Ctrl+C.
Без `--app` команда `run` читает настройки и установку из текущего каталога.
Удаление: `th uninstall ./home ThinkingHome.Plugins.Timer`.

Операции `install|uninstall|ci|validate|recover` принимают каталог приложения первым аргументом.
Обновление инструмента через `dotnet tool update` обновляет хост и менеджер вместе; установленные плагины и пользовательские настройки находятся отдельно.
