# ThinkingHome

ThinkingHome - кроссплатформенное приложение, позволяющее организовать на компьютере управляющий центр умного дома.

В этом репозитории находится версия для .NET Core. Также существует [версия для .NET Framework](https://github.com/dima117/thinking-home).

## Плагины

- [ThinkingHome.Plugins.Cron](./ThinkingHome.Plugins.Cron) - запуск действий по расписанию
- [ThinkingHome.Plugins.Cron.WebApi](./ThinkingHome.Plugins.Cron.WebApi) - web API для [cron](./ThinkingHome.Plugins.Cron)
- [ThinkingHome.Plugins.Cron.WebUi](./ThinkingHome.Plugins.Cron.WebUi) - web-интерфейс для редактирования расписания [cron](./ThinkingHome.Plugins.Cron)
- [ThinkingHome.Plugins.Database](./ThinkingHome.Plugins.Database) - API для хранения информации плагинов в БД
- [ThinkingHome.Plugins.Mail](./ThinkingHome.Plugins.Mail) - отправка email
- [ThinkingHome.Plugins.Mqtt](./ThinkingHome.Plugins.Mqtt) - отправка/получение сообщений MQTT
- [ThinkingHome.Plugins.NooLite](./ThinkingHome.Plugins.NooLite) - управление освещением/электроприборами с помощью устройств [nooLite](https://www.noo.com.by/sistema-noolite.html)
- [ThinkingHome.Plugins.Scripts](./ThinkingHome.Plugins.Scripts) - выполнение сценариев автоматизации
- [ThinkingHome.Plugins.Scripts.WebApi](./ThinkingHome.Plugins.Scripts.WebApi) - web API для управления сценариями
- [ThinkingHome.Plugins.Scripts.WebUi](./ThinkingHome.Plugins.Scripts.WebUi) - web-интерфейс для управления сценариями
- [ThinkingHome.Plugins.TelegramBot](./ThinkingHome.Plugins.TelegramBot) - Telegram бот
- [ThinkingHome.Plugins.Timer](./ThinkingHome.Plugins.Timer) - выполнение действий по таймеру
- [ThinkingHome.Plugins.WebServer](./ThinkingHome.Plugins.WebServer) - инфраструктура для обращения к методам плагинов по HTTP
- [ThinkingHome.Plugins.WebServer.UrlValidation](./ThinkingHome.Plugins.WebServer.UrlValidation) - валидация URL методов плагинов на соответствие правилам
- [ThinkingHome.Plugins.WebUi](./ThinkingHome.Plugins.WebUi) - инфраструктура веб-интерфейса
- [ThinkingHome.Plugins.WebUi.Apps](./ThinkingHome.Plugins.WebUi.Apps) - организация подразделов веб-интерфейса

**[Как написать свой плагин](ThinkingHome.Core.Plugins)**

## Установка с помощью Docker

### 1. Установите Docker

Прежде, чем вы попробуете запустить образ ThinkingHome для Docker, вы должны установить Docker. Прочитайте инструкции для [Windows](http://www.docker.com/products/docker#/windows), [MacOS](http://www.docker.com/products/docker#/mac) и [Linux](http://www.docker.com/products/docker#/linux), чтобы узнать подробнее про установку Docker.

### 2. Запустите контейнер базы данных

Многие плагины сохраняют своё состояние в базе данных. Для их корректной работы необходимо предоставить доступ к БД. ThinkingHome поддерживает работу с СУБД PostgreSQL.

С помошью следующей команды вы можете подключить образ PostgreSQL из [Docker Store](https://store.docker.com/images/postgres).

```
$ docker run --name postgres -e POSTGRES_PASSWORD=123 -p 5432:5432 -d postgres
```

- Параметр `--name` задает имя, используя которое вы можете давать доступ к контейнеру БД для других контейнеров.
- Переменная окружения `POSTGRES_PASSWORD` задает пароль для подключнения к БД с логином `postgres`. Важно указать значение `123`, т.к. этот пароль установлен по умолчанию в контейнере ThinkingHome.
- Параметр `-p` задает соответствие портов вашего компьютера и портов контейнера БД.

После того, как контейнер будет запущен, вы сможете подключаться к БД со своего компьютера, используся строку подключения `host=localhost;port=5431;database=postgres;user name=postgres;password=123`.

### 3. Запустите контейнер ThinkingHome

```
$ docker run --name thinking-home --link postgres:postgres -p 8080:8080 -t dima117a/thinking-home:4.0.0-alpha4
```

После запуска в консоль начнет выодиться лог приложения, а в браузере по адресу http://localhost:8080 будет доступен веб-интерфейс.

