## Why

Плагины `WebServer` и `WebServer.UrlValidation` (следующие по порядку зависимостей плагины после `Database`) пока не описаны спецификациями. `WebServer` — общая инфраструктура для HTTP-обработчиков и клиент-серверной шины сообщений, на которую будут ссылаться будущие спецификации других плагинов (Cron+WebApi+WebUi, Mail, Mqtt, NooLite, TelegramChatList+WebApi, WebUi). `UrlValidation` — связанный плагин, проверяющий зарегистрированные URL по контракту `WebServer`, поэтому описывается тем же изменением.

## What Changes

- Добавить спецификацию капабилити `plugins/web-server/http-resources`: регистрация статических (в т.ч. предсжатых) и динамических HTTP-ресурсов через `WebServerConfigurationBuilder`, обработка запроса (`HomePluginsMiddleware`), формирование ответа (`HttpHandlerResult`), чтение параметров запроса (`HttpRequestParams`), обработка ошибок (`HttpHandlerException`), порт сервера.
- Добавить спецификацию капабилити `plugins/web-server/message-bus`: клиент-серверная шина сообщений на SignalR (`MessageHub`), отправка сообщений с сервера и обработка входящих сообщений через `RegisterMessageHandler`.
- Добавить спецификацию капабилити `plugins/web-server/url-validation`: контракт проверки соответствия зарегистрированных URL правилам именования (plugin alias, префиксы `/api`, `/dynamic`, `/static`, `/vendor`, требования к расширению) и публикация списка ошибок по HTTP.

## Capabilities

### New Capabilities
- `plugins/web-server/http-resources`: регистрация и обработка статических и динамических HTTP-ресурсов веб-сервером плагинов
- `plugins/web-server/message-bus`: клиент-серверная шина сообщений поверх SignalR
- `plugins/web-server/url-validation`: проверка URL зарегистрированных HTTP-ресурсов по правилам формирования адресов

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.WebServer/*` (WebServerPlugin, WebServerConfigurationBuilder, HomePluginsMiddleware, Handlers/*, Messages/*, Attributes/*)
- `ThinkingHome.Plugins.WebServer.UrlValidation/UrlValidationPlugin.cs`
- Новые спецификации: `openspec/specs/plugins/web-server/http-resources/spec.md`, `openspec/specs/plugins/web-server/message-bus/spec.md`, `openspec/specs/plugins/web-server/url-validation/spec.md`
