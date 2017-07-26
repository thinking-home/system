# ThinkingHome

ThinkingHome - кроссплатформенное приложение, позволяющее организовать на компьютере управляющий центр умного дома.

## 

## Установка с помощью Docker

### 1. Установите Docker

Прежде, чем вы попробуете запустить образ ThinkingHome для Docker, вы должны установить Docker. Прочитайте инструкции для [Windows](http://www.docker.com/products/docker#/windows), [MacOS](http://www.docker.com/products/docker#/mac) и [Linux](http://www.docker.com/products/docker#/linux), чтобы узнать подробнее про установку Docker. 

### 2. Запустите контейнер базы данных

Многие плагины сохраняют своё состояние в базе данных. Для их корректной работы необходимо предоставить доступ к БД. ThinkingHome поддерживает работу с СУБД PostgreSQL. 

С помошью следующей команды вы можете подключить образ PostgreSQL из [Docker Store](https://store.docker.com/images/postgres).

```sh
docker run --name some-postgres -e POSTGRES_PASSWORD=123 -p 5432:5432 -d postgres
```  

- Параметр `--name` задает имя, используя которое вы можете давать доступ к контейнеру БД для других контейнеров.
- Переменная окружения `POSTGRES_PASSWORD` задает пароль для подключнения к БД с логином `postgres`.
- Параметр `-p` задает соответствие портов вашего компьютера и портов контейнера БД.

После того, как контейнер будет запущен, вы сможете подключаться к БД со своего компьютера, используся строку подключения `host=localhost;port=5432;database=postgres;user name=postgres;password=123`.

### 3. Запустите контейнер приложения

The following command will get you a running container with the toolchain, straight off of Microsoft's Docker Hub.

```sh
docker run --name some-app --link some-postgres:postgres -p 8080:8080 -it microsoft/dotnet:2.0-sdk
```

- Параметр `--name` задает имя, по которому можно ссылатсья на него.
- Параметр `--link` создает связь с контейнером БД. Внутри контейнера приложения контейнер БД будет доступен по имени `postgres`.
- Параметр `-p` задает соответствие портов вашего компьютера и портов контейнера приложения.
- Параметры `-it` задают интерактивный режим запуска контейнера (после запуска откроется командная строка, в которой можно выполнять команды)

### 4. Установите ThinkingHome внутри контейнера

```sh
$ cd
$ git clone https://github.com/thinking-home/system.git
$ cd system/
$ dotnet restore
```

### 5. Настройте и запустите ThinkingHome

```
$ apt-get update
$ apt-get install nano

# отредактируйте строку подключения
$ nano ThinkingHome.Console/appsettings.json

# соберите и запустите приложения
$ dotnet build
$ cd ThinkingHome.Console/bin/Debug/netcoreapp2.0/
$ dotnet ThinkingHome.Console.dll
```

После запуска в консоль начнет выодиться лог приложения, а в браузере по адресу http://localhost:8080 будет доступен веб-интерфейс.