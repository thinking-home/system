---
id: project.contracts
summary: HTTP API плагинов (JSON, параметры в query string и form), шина SignalR /hub, сценарные события и их meta, MQTT scriptEvents, таблицы БД, потребители через NuGet и UI-кит; машиночитаемых контрактов нет
read_when: При изменении интерфейсов и интеграций
updated: 2026-09-15
verification: needs-review
---

# Интеграции и контракты

## Внешние API

Предоставляемые HTTP API — динамические ресурсы `WebServerPlugin`: параметры читаются из query string и form (`HttpRequestParams`), ответ — JSON или пустое тело, отсутствие обязательного параметра → 400, прочие ошибки → 500. Подробности — в `README.md` проектов `.WebApi`.

| Плагин | URL | Параметры | Ответ |
|---|---|---|---|
| Scripts.WebApi | `/api/scripts/web-api/list` | — | массив `{id, name}` |
| | `/api/scripts/web-api/get` | `id` | `{id, name, body}` |
| | `/api/scripts/web-api/save` | `id` (необязательный), `name`, `body` | `{scriptId}` |
| | `/api/scripts/web-api/delete` | `id` | пусто |
| | `/api/scripts/web-api/execute` | `id` | результат сценария |
| | `/api/scripts/web-api/events/list` | — | `{events: [{name}], userEvent: {name, metaKey}}` |
| | `/api/scripts/web-api/subscription/list` | — | массив `{id, scriptId, scriptName, eventName, metaFilter}` |
| | `/api/scripts/web-api/subscription/add` | `scriptId`, `eventName`, `metaFilter` (необязательный) | `{subscriptionId}` |
| | `/api/scripts/web-api/subscription/delete` | `subscriptionId` | пусто |
| Cron.WebApi | `/api/cron/web-api/list`, `/api/cron/web-api/get` | `id` для get | `{id, name, eventName, enabled, expression, description}` |
| | `/api/cron/web-api/save` | `id` (необязательный), `name`, `eventName`, `expression`, `enabled`; некорректное выражение → 400 | `{taskId}` |
| | `/api/cron/web-api/delete` | `id` | пусто |
| | `/api/cron/web-api/describe` | `expression` | `{valid, description}` |
| TelegramChatList.WebApi | `/api/telegram-chat-list/web-api/list` | — | массив `{id, login, chatId, firstName, lastName, date}` |
| WebUi | `/api/webui/meta` | — | `{pages: {url: {js, langId}}, config: {lang, messageHub: {route, clientMethod, serverMethod, reconnectionTimeout}}}` |
| | `/api/webui/lang` | `id` | словарь строк; неизвестный id → 400 |
| WebServer.UrlValidation | `/dynamic/web-server/url-validation/errors.txt` | — | текст, по ошибке на строку |

Потребляемые внешние API: Telegram Bot API (`Telegram.Bot`, long polling), MQTT-брокер (`MQTTnet`, QoS «at least once» при публикации), SMTP (`MailKit`), serial-протокол nooLite MTRF-64 (`ThinkingHome.NooLite`), PostgreSQL (`Npgsql`).

## События

Сценарные события — внутрипроцессные, с именем, словарём meta (строка → строка) и параметрами `args`:

| Событие | Владелец | meta | Параметры |
|---|---|---|---|
| `scripts:user-event` | `ScriptsPlugin` | `name` и произвольные дополнительные | массив аргументов `EmitUserEvent` или `host.emit` |
| `cron:task:started` | `CronPlugin` | `taskId` | — |
| `noolite:data:received` | `NooLitePlugin` | `channel`, `command` | `NooLiteDataEventArgs` (`Command`, `Channel`, `Format`, `Data1…Data4`) |
| `noolite:microclimate-data:received` | `NooLitePlugin` | `channel` | `NooLiteMicroclimateEventArgs` (`Channel`, `Temperature`, `Humidity`, `LowBattery`) |
| пользовательские события из `scriptEvents` MQTT | `MqttPlugin` через `scripts:user-event` | `name`, `topic` | `args[0]` — топик, `args[1]` — `Buffer` |

Шина сообщений SignalR (`ThinkingHome.Plugins.WebServer/Messages/MessageHub.cs`): маршрут `/hub`, серверный метод `Send(topic, data)`, клиентский метод `serverMessage` с объектом `{guid, timestamp, topic, data}`, рекомендуемый таймаут переподключения 7000 мс; серверные обработчики топиков — `RegisterMessageHandler(topic, fn)`.

.NET-событие `TelegramBotPlugin.OnMessageReceived` отдаёт каждое входящее сообщение бота; атрибуты-обработчики перечислены в `architecture.md`.

## Схемы

- Таблицы PostgreSQL, создаются миграциями: `Scripts_UserScript` (`Id`, `Name`, `Body`), `Scripts_EventHandler` (`Id`, `EventName`, `MetaFilter`, `UserScriptId`, каскадное удаление), `Cron_Task` (`Id`, `Name`, `EventName`, `Expression`, `Enabled`), `TelegramChatList_Chat` (`Id`, `Login`, `ChatId` уникальный, `Date`, `FirstName`, `LastName`). Версия схемы — номер `[Migration(N)]` в сборке плагина; `ThinkingHome.Plugins.Scripts/Model/Migrations/Migration03.cs` пересоздаёт таблицу подписок без переноса данных.
- Фильтр подписки: query string с URL-кодированием и сортировкой ключей (`MetaFilter.Serialize`); пустая строка или `null` — без фильтра.
- Выражение cron: пять сегментов `минута час день месяц день-недели`, синтаксис NCrontab.
- Конфигурация: `appsettings.json` с ключами `culture`, `assemblies`, `Serilog`, `plugins.{FullName}`; переопределение переменными `THINKINGHOME_a__b__c`.
- Клиентские схемы ответов: valibot в `ThinkingHome.Plugins.WebUi/frontend/utils/types.ts` (`MetaResponseSchema`, `LangDataSchema`, `MessageHubMessageSchema`) и в `ThinkingHome.Plugins.Scripts.WebUi/frontend/api.ts`.

## Потребители

- Сторонние плагины на NuGet-пакетах `ThinkingHome.Core.Plugins` и `ThinkingHome.Plugins.*`: используют публичные методы, атрибуты и билдеры, описанные в README плагинов.
- Клиентские бандлы разделов: зависят от @thinking-home/ui (отдельный репозиторий) и от `/api/webui/meta`, `/api/webui/lang`, vendor-модулей хоста.
- Сценарии пользователей в БД: `host.api.*`, `host.scripts.*`, `host.log`, `host.emit`, константы `meta` и `args` — менять только с обратной совместимостью, сценарии не пересобираются.
- Версионирования HTTP API и событий нет; совместимость отслеживается вручную.

## Машиночитаемые контракты

— : OpenAPI, JSON Schema и protobuf в репозитории нет, и вводить их не планируется (решение владельца: специфика проекта — локальный сервер с UI, собранным в том же репозитории). Источник истины для HTTP API и шины — текстовые спецификации `openspec/specs/plugins/*/http-api/spec.md`, `openspec/specs/plugins/web-server/message-bus/spec.md` и valibot-схемы на клиенте.
