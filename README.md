# ThinkingHome

ThinkingHome - кроссплатформенное приложение, позволяющее организовать на компьютере управляющий центр умного дома.

## 

## Установка с помощью Docker

### 1. Установите Docker

Прежде, чем вы попробуете запустить образ ThinkingHome для Docker, вы должны установить Docker. Прочитайте инструкции для [Windows](http://www.docker.com/products/docker#/windows), [MacOS](http://www.docker.com/products/docker#/mac) и [Linux](http://www.docker.com/products/docker#/linux), чтобы узнать подробнее про установку Docker. 

### 2. Соберите образ ThinkingHome

Следующая команда собирает Docker образ `system:4.0.0-alpha2`, содержащий установленную систему ThinkingHome.

```
sh build.sh
```

### 3. Запустите контейнер базы данных

Многие плагины сохраняют своё состояние в базе данных. Для их корректной работы необходимо предоставить доступ к БД. ThinkingHome поддерживает работу с СУБД PostgreSQL. 

С помошью следующей команды вы можете подключить образ PostgreSQL из [Docker Store](https://store.docker.com/images/postgres).

```sh
docker run --name some-postgres -e POSTGRES_PASSWORD=123 -p 5431:5432 -d postgres
```  

- Параметр `--name` задает имя, используя которое вы можете давать доступ к контейнеру БД для других контейнеров.
- Переменная окружения `POSTGRES_PASSWORD` задает пароль для подключнения к БД с логином `postgres`.
- Параметр `-p` задает соответствие портов вашего компьютера и портов контейнера БД.

После того, как контейнер будет запущен, вы сможете подключаться к БД со своего компьютера, используся строку подключения `host=localhost;port=5431;database=postgres;user name=postgres;password=123`.

### 3. Запустите контейнер ThinkingHome

```
docker run --name some-app --link some-postgres:postgres -p 8080:8080 -e "plugins:ThinkingHome.Plugins.Database.DatabasePlugin:connectionString=host=postgres;port=5432;database=postgres;user name=postgres;password=123" -t system:4.0.0-alpha2
```

После запуска в консоль начнет выодиться лог приложения, а в браузере по адресу http://localhost:8080 будет доступен веб-интерфейс.

