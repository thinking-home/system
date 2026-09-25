---
id: project.overview
summary: ThinkingHome — сервер умного дома на .NET 10 с плагинами, веб-интерфейсом и JS-сценариями; кто пользуется, что рядом, где код и спецификации OpenSpec
read_when: Перед исследованием и планированием любого изменения
updated: 2026-09-15
verification: needs-review
---

# Продукт и границы

## Что за продукт

Категория: серверное приложение умного дома (home automation hub) с расширением через плагины.

ThinkingHome — кроссплатформенный управляющий центр умного дома на .NET 10 (`README.md`; версия `4.0.0-alpha34` в `Package.xml`). Хост `ThinkingHome.Console` загружает плагины из сборок, перечисленных в ключе `assemblies` файла `ThinkingHome.Console/appsettings.json`, и запускает их в одном процессе. Плагины дают JS-сценарии автоматизации (Jint), расписание cron, таймеры, веб-сервер с HTTP API и шиной сообщений SignalR, веб-интерфейс на React, интеграции MQTT, nooLite, Telegram и SMTP. Поставляется как docker-образ dima117a/thinking-home и как NuGet-пакеты `ThinkingHome.*` для авторов сторонних плагинов.

## Пользователи

| Роль | Сценарии | Источник |
|---|---|---|
| Владелец умного дома (администратор) | ставит систему через Docker, правит `appsettings.json`, пишет сценарии, подписки и расписание в веб-интерфейсе (разделы `/scripts`, `/cron`) | `README.md`, `ThinkingHome.Plugins.Scripts.WebUi/README.md` |
| Разработчик плагинов | наследует `PluginBase`, подключает NuGet-пакеты, регистрирует HTTP-ресурсы, разделы UI, события | `ThinkingHome.Core.Plugins/README.md` |
| Пользователь Telegram-бота | отправляет команды боту в личном чате; обрабатываются только логины из `authorizedLogins` | `ThinkingHome.Plugins.TelegramBot/README.md` |

Ролей и аутентификации в веб-интерфейсе нет: в `ThinkingHome.Plugins.WebServer` и `ThinkingHome.Plugins.WebUi` нет кода авторизации; система рассчитана на локальную сеть (комментарий в `ThinkingHome.Plugins.Scripts.WebUi/ScriptsWebUiPlugin.cs`).

## Системы рядом

| Система | Роль | Где настраивается |
|---|---|---|
| PostgreSQL | единственная поддерживаемая СУБД, миграции применяются при старте | `ThinkingHome.Plugins.Database`, ключ `connectionString` |
| MQTT-брокер | публикация и подписка на топики | `ThinkingHome.Plugins.Mqtt`, ключи `host`, `port`, `login`, `password`, `scriptEvents` |
| Адаптер nooLite MTRF-64 (serial-порт) | управление освещением и приём данных датчиков | `ThinkingHome.Plugins.NooLite`, ключ `portName` |
| Telegram Bot API | приём команд long polling, отправка сообщений и файлов | `ThinkingHome.Plugins.TelegramBot`, ключи `token`, `authorizedLogins` |
| SMTP-сервер | отправка писем | `ThinkingHome.Plugins.Mail`, ключи `smtpHost`, `smtpPort`, `auth` |
| Браузер | веб-интерфейс и SignalR-клиент | `ThinkingHome.Plugins.WebUi`, `ThinkingHome.Plugins.WebServer` |
| npm-пакеты @thinking-home/ui, @thinking-home/i18n | UI-кит, сборщик `th-build`, vendor-модули React и Mantine | `ThinkingHome.Plugins.WebUi/package.json` |

От продукта зависят сторонние плагины, собранные на NuGet-пакетах `ThinkingHome.Core.Plugins` и `ThinkingHome.Plugins.*`, и клиентские бандлы разделов, использующие `/api/webui/meta` и `/api/webui/lang`.

## Где живёт код

Репозиторий `git@github.com:thinking-home/system.git`, решение `ThinkingHome.sln`, все проекты `net10.0`.

| Каталог | Что лежит |
|---|---|
| `ThinkingHome.Console` | хост-приложение: `Program.cs`, `appsettings.json`, `README.md` о локальном запуске |
| `ThinkingHome.Core.Plugins` | базовый класс `PluginBase`, реестры, расширения `FindMethods` и `SafeInvoke`, инструкция для авторов плагинов |
| `ThinkingHome.Core.Infrastructure` | чтение конфигурации, DI, запуск и остановка плагинов |
| `ThinkingHome.Plugins.*` | один проект на плагин; суффикс `.WebApi` — HTTP API плагина, `.WebUi` — разделы веб-интерфейса; у UI-проектов каталог `frontend` и `package.json` |
| `ThinkingHome.Tests` | xunit-тесты |
| `openspec` | спецификации и архив изменений OpenSpec |
| `.sbox` | конфиг и документация @spec-box/sdd; `.claude` — агенты и скиллы sbox для Claude Code |
| `Dockerfile`, `Package.xml` | сборка образа; общие свойства NuGet-пакетов и версия |


## Истина спецификаций

- Формат OpenSpec, адаптер `openspec` (`.sbox/config.yaml`), корень `openspec`.
- Файлы `openspec/specs/{capability}/spec.md`; capability двухуровневые: `core/{name}` и `plugins/{plugin}/{name}`; всего 31 capability.
- Структура файла: заголовок `# {capability} Specification`, разделы `## Purpose` и `## Requirements`, требования `### Requirement: …` с формулировкой SHALL, сценарии `#### Scenario: …` со строками WHEN и THEN (шаблон `openspec/schemas/agentic/templates/spec.md`).
- Чтение: `sbox spec list` — список capability со счётчиками групп и утверждений; `sbox spec show {id}` — capability целиком, например `sbox spec show plugins/scripts/script-events`.
- Изменения: дельты в `openspec/changes/{id}/specs/`, после доставки — `openspec/changes/archive/`; активных изменений нет (`sbox change list`).
- Внешней системы выгрузки спецификаций нет.
