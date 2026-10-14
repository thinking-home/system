# ThinkingHome

ThinkingHome - кроссплатформенное приложение, позволяющее организовать на компьютере управляющий центр умного дома.

В этом репозитории находится версия для .NET Core. Также существует [версия для .NET Framework](https://github.com/dima117/thinking-home).

## Плагины

- [ThinkingHome.Plugins.Cron](./ThinkingHome.Plugins.Cron) - запуск действий по расписанию
- [ThinkingHome.Plugins.Cron.WebApi](./ThinkingHome.Plugins.Cron.WebApi) - web API для [cron](./ThinkingHome.Plugins.Cron)
- [ThinkingHome.Plugins.Cron.WebUi](./ThinkingHome.Plugins.Cron.WebUi) - раздел веб-интерфейса для управления расписанием
- [ThinkingHome.Plugins.Database](./ThinkingHome.Plugins.Database) - API для хранения информации плагинов в БД
- [ThinkingHome.Plugins.Mail](./ThinkingHome.Plugins.Mail) - отправка email
- [ThinkingHome.Plugins.Mqtt](./ThinkingHome.Plugins.Mqtt) - отправка/получение сообщений MQTT
- [ThinkingHome.Plugins.NooLite](./ThinkingHome.Plugins.NooLite) - управление освещением/электроприборами с помощью устройств [nooLite](https://www.noo.com.by/sistema-noolite.html)
- [ThinkingHome.Plugins.Scripts](./ThinkingHome.Plugins.Scripts) - выполнение сценариев автоматизации
- [ThinkingHome.Plugins.Scripts.WebApi](./ThinkingHome.Plugins.Scripts.WebApi) - web API для управления сценариями
- [ThinkingHome.Plugins.Scripts.WebUi](./ThinkingHome.Plugins.Scripts.WebUi) - разделы веб-интерфейса для работы со сценариями
- [ThinkingHome.Plugins.TelegramBot](./ThinkingHome.Plugins.TelegramBot) - Telegram бот
- [ThinkingHome.Plugins.TelegramChatList](./ThinkingHome.Plugins.TelegramChatList) - сохранение информации о чатах с Telegram ботом
- [ThinkingHome.Plugins.TelegramChatList.WebApi](./ThinkingHome.Plugins.TelegramChatList.WebApi) - web API для просмотра списка сохраненных чатов
- [ThinkingHome.Plugins.TelegramChatList.WebUi](./ThinkingHome.Plugins.TelegramChatList.WebUi) - раздел веб-интерфейса со списком сохраненных чатов
- [ThinkingHome.Plugins.Timer](./ThinkingHome.Plugins.Timer) - выполнение действий по таймеру
- [ThinkingHome.Plugins.WebServer](./ThinkingHome.Plugins.WebServer) - инфраструктура для обращения к методам плагинов по HTTP
- [ThinkingHome.Plugins.WebServer.UrlValidation](./ThinkingHome.Plugins.WebServer.UrlValidation) - валидация URL методов плагинов на соответствие правилам
- [ThinkingHome.Plugins.WebUi](./ThinkingHome.Plugins.WebUi) - инфраструктура для веб-интерфейса

**[Как написать свой плагин](ThinkingHome.Core.Plugins)**

## Установка с помощью Docker

Dockerfile создаёт комплект хоста и менеджера пакетов без предустановленных плагинов. Соберите образ из текущих исходников:

```shell
docker build -t thinkinghome:local .
```

Подготовьте каталог `application` с пользовательским `appsettings.json` и файлом [источников пакетов](ThinkingHome.PackageSources/README.md) `sources.json`. Адреса репозиториев должны быть доступны из контейнера. Установите нужный плагин через менеджер из того же образа; замените `Example.Plugin` и диапазон версии на опубликованный пакет:

```shell
docker run --rm --entrypoint dotnet -v "./application:/data" thinkinghome:local ThinkingHome.PackageManagement.dll install /data Example.Plugin "[1.0.0]" /data/sources.json
```

Проверьте установленный набор и запустите хост с тем же каталогом данных:

```shell
docker run --rm -v "./application:/data" thinkinghome:local --app /data --check
docker run --name thinking-home -v "./application:/data" -p 8080:8080 thinkinghome:local --app /data
```

Доступность веб-интерфейса, БД и других сервисов зависит от установленных плагинов и их настроек. Подключение PostgreSQL описано в [документации плагина базы данных](ThinkingHome.Plugins.Database/README.md). После изменения состава плагинов хост нужно перезапустить. При обновлении образа учитывайте [контракт совместной поставки и проверки платформы](ThinkingHome.Platform/README.md).

## Для разработчиков

### Поставка плагинов через NuGet

Пакетная система поддерживает планирование, установку, locked-восстановление и загрузку пакетов в хост. Установленные пакеты и локальные DLL запускаются одним хостом, без упаковки перед отладкой.

- [Упаковка плагинов и статическая валидация](ThinkingHome.Packaging/README.md)
- [Сервер репозитория для локальной папки](ThinkingHome.Repository/README.md)
- [Поиск версий и скачивание пакетов](ThinkingHome.PackageSources/README.md)
- [Разрешение зависимостей и план установки](ThinkingHome.PackagePlanning/README.md)
- [Установка, locked-восстановление и валидация](ThinkingHome.PackageManagement/README.md)
- [Общий API платформы и контракт совместной поставки](ThinkingHome.Platform/README.md)
- [Сервер, отладка плагина и монорепозитория](ThinkingHome.PackageRuntime/README.md)
- [Архитектурные решения и план MVP](.sbox/project/decisions/README.md)
- [Команды сборки и тестирования](.sbox/project/testing.md)

Хост ThinkingHome.Console использует установленный набор и необязательный plugins.local.json. Для сборки всех локальных плагинов и генерации подключений используйте ThinkingHome.Local.proj.
