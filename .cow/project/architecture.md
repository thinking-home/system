---
id: project.architecture
summary: Хост, ядро плагинов, карта плагинов и их зависимостей, точки входа через атрибуты-обработчики и HTTP, поток данных, границы модулей, генерируемые клиентские бандлы
read_when: Перед исследованием, планированием и реализацией
updated: 2026-09-15
verification: needs-review
---

# Архитектура и карта кода

## Карта пакетов и модулей

Зависимости взяты из `ProjectReference` в `.csproj`; все проекты дополнительно зависят от `ThinkingHome.Core.Plugins`.

| Проект | Ответственность | Зависит от | С чего начинать |
|---|---|---|---|
| `ThinkingHome.Console` | хост: читает конфиг, запускает `HomeApplication`, ждёт Ctrl+C, останавливает плагины | все плагины | `ThinkingHome.Console/Program.cs` |
| `ThinkingHome.Core.Plugins` | `PluginBase`, `IServiceContext`, `EventContext`, реестры `ObjectRegistry` и `ObjectSetRegistry`, `BaseConfigurationBuilder`, расширения `FindMethods`, `FindAttrs`, `SafeInvoke` | — | `ThinkingHome.Core.Plugins/PluginBase.cs`, `ThinkingHome.Core.Plugins/Utils/Extensions.cs` |
| `ThinkingHome.Core.Infrastructure` | `HomeConfiguration` (appsettings и переменные `THINKINGHOME_`), `HomeApplication` (DI, Serilog, init/start/stop), `ServiceContext` | — | `ThinkingHome.Core.Infrastructure/HomeApplication.cs` |
| `ThinkingHome.Plugins.Database` | EF Core и Npgsql, миграции ThinkingHome.Migrator при старте, `OpenSession()` | — | `ThinkingHome.Plugins.Database/DatabasePlugin.cs` |
| `ThinkingHome.Plugins.Timer` | периодические колбэки `[TimerCallback]` | — | `ThinkingHome.Plugins.Timer/TimerPlugin.cs` |
| `ThinkingHome.Plugins.Scripts` | JS-сценарии на Jint, `[ScriptCommand]`, сценарные события, подписки с фильтром meta | Database | `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs` |
| `ThinkingHome.Plugins.Scripts.WebApi` | HTTP API сценариев, событий и подписок | Database, Scripts, WebServer | `ThinkingHome.Plugins.Scripts.WebApi/ScriptsWebApiPlugin.cs` |
| `ThinkingHome.Plugins.Scripts.WebUi` | разделы `/scripts`, `/scripts/edit`, `/scripts/subscriptions` (React, CodeMirror) | WebServer, WebUi | `ThinkingHome.Plugins.Scripts.WebUi/ScriptsWebUiPlugin.cs`, `ThinkingHome.Plugins.Scripts.WebUi/frontend` |
| `ThinkingHome.Plugins.Cron` | записи расписания `CronTask`, проверка каждые 20 с по таймеру, событие `cron:task:started` | Database, Scripts, Timer | `ThinkingHome.Plugins.Cron/CronPlugin.cs` |
| `ThinkingHome.Plugins.Cron.WebApi` | HTTP API расписания и описание выражений cron | Cron, Database, WebServer | `ThinkingHome.Plugins.Cron.WebApi/CronWebApiPlugin.cs` |
| `ThinkingHome.Plugins.Cron.WebUi` | раздел `/cron` | WebServer, WebUi | `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs` |
| `ThinkingHome.Plugins.WebServer` | Kestrel, middleware обработчиков HTTP, сжатие, SignalR `MessageHub` | — | `ThinkingHome.Plugins.WebServer/WebServerPlugin.cs` |
| `ThinkingHome.Plugins.WebServer.UrlValidation` | проверка URL ресурсов по правилам alias | WebServer | `ThinkingHome.Plugins.WebServer.UrlValidation/UrlValidationPlugin.cs` |
| `ThinkingHome.Plugins.WebUi` | оболочка веб-интерфейса: `index.html`, `main.js`, vendor-модули, `/api/webui/meta`, `/api/webui/lang` | WebServer | `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs`, `ThinkingHome.Plugins.WebUi/frontend/index.tsx` |
| `ThinkingHome.Plugins.Mqtt` | клиент MQTTnet, `[ConfigureMqtt]`, публикация, секция `scriptEvents` | Scripts, Timer | `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs` |
| `ThinkingHome.Plugins.NooLite` | адаптер MTRF-64, `[NooLiteCommandHandler]`, `[NooLiteMicroclimateDataHandler]`, события `noolite:*` | Scripts, Timer | `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs` |
| `ThinkingHome.Plugins.Mail` | SMTP через MailKit, сценарные команды `sendMail`, `sendMailWithAttachment` | Scripts | `ThinkingHome.Plugins.Mail/MailPlugin.cs` |
| `ThinkingHome.Plugins.TelegramBot` | long polling Telegram.Bot, `[TelegramMessageHandler]`, отправка сообщений и файлов | — | `ThinkingHome.Plugins.TelegramBot/TelegramBotPlugin.cs` |
| `ThinkingHome.Plugins.TelegramChatList` | сохранение чатов бота в БД | Database, TelegramBot | `ThinkingHome.Plugins.TelegramChatList/TelegramChatListPlugin.cs` |
| `ThinkingHome.Plugins.TelegramChatList.WebApi` | список чатов по HTTP | Database, TelegramChatList, WebServer | `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` |
| `ThinkingHome.Plugins.Tmp` | песочница автора: демо-страницы и вызовы API других плагинов; спецификации нет | почти все | `ThinkingHome.Plugins.Tmp/TmpPlugin.cs` |
| `ThinkingHome.Tests` | xunit-тесты | Scripts, TelegramBot | `ThinkingHome.Tests` |

Клиентская часть (`frontend/*.tsx`) есть у WebUi, Scripts.WebUi, Cron.WebUi и Tmp; она собирается в каталог `*/Resources/app/**` (`vite build` в WebUi, `th-build` из @thinking-home/ui в остальных) и встраивается в DLL как `EmbeddedResource`.

## Точки входа

| Тип | Где начинается |
|---|---|
| Процесс | `ThinkingHome.Console/Program.cs` → `HomeApplication.StartServices` → `InitPlugin` всех плагинов по `DependencyIndex`, затем `StartPlugin`; Ctrl+C → `StopServices` в обратном порядке |
| HTTP-ресурс | метод плагина с `[ConfigureWebServer]` регистрирует URL через `WebServerConfigurationBuilder` (`RegisterEmbeddedResource`, `RegisterDynamicResource`); запрос обрабатывает `HomePluginsMiddleware` |
| Раздел веб-интерфейса | метод с `[ConfigureWebUi]` вызывает `RegisterPage(url, bundle)`; клиент читает `/api/webui/meta` и подгружает бандл раздела по маршруту |
| Шина сообщений | SignalR hub по маршруту `/hub`; серверные обработчики через `RegisterMessageHandler(topic, fn)`, отправка через `WebServerPlugin.Send(topic, data)` |
| Сценарии | `ScriptsPlugin.ExecuteScript`, `ExecuteScriptByName`, HTTP `/api/scripts/web-api/execute`, подписки на события |
| Сценарные события | метод с `[ConfigureScriptEvents]` вызывает `RegisterEvent(name)` и получает emitter; `EmitUserEvent(name, …)` и `host.emit` из сценария |
| Таймер | метод с `[TimerCallback(interval, delay)]`, интервал в миллисекундах |
| Cron | метод с `[CronHandler]`; запись `CronTask` с полем `EventName` порождает пользовательское событие |
| MQTT | метод с `[ConfigureMqtt]` вызывает `RegisterListener(topicFilter, handler)`; секция `scriptEvents` связывает фильтры топиков с событиями |
| Telegram | метод с `[TelegramMessageHandler("cmd")]`; .NET-событие `OnMessageReceived` |
| БД | метод с `[DbModelBuilder]` настраивает EF-модель; классы `Migration` с `[Migration(n)]` в сборке плагина |

Общий приём: плагин-владелец точки входа при `InitPlugin` находит методы других плагинов через `Context.GetAllPlugins()` и `FindMethods`, складывает их в реестр и вызывает через `SafeInvoke` или `SafeInvokeAsync`.

## Поток данных

1. Конфигурация: `appsettings.json` → `appsettings.{THINKINGHOME_ENVIRONMENT}.json` → переменные `THINKINGHOME_*` (разделитель `__`); секция `plugins:{FullName}` попадает в `PluginBase.Configuration`.
2. Старт: `ServiceContext` раздаёт плагинам `Context`, `Logger`, `Configuration`, `StringLocalizer`; `DatabasePlugin.InitPlugin` применяет миграции всех сборок плагинов; порядок init/start — по `DependencyIndex`, то есть по порядку создания экземпляров DI.
3. HTTP-запрос: Kestrel → routing (`/hub`) → сжатие → `HomePluginsMiddleware` ищет путь в реестре обработчиков; статический ресурс кэшируется 2 часа с учётом `Accept-Encoding`, динамический вызывает `HttpHandlerDelegate(HttpRequestParams)` и отдаёт `HttpHandlerResult` (Json, Text, Binary); `HttpHandlerException` задаёт код ответа, прочие ошибки → 500; незарегистрированный путь уходит дальше по конвейеру.
4. Событие → сценарий: плагин вызывает emitter → `ScriptsPlugin.EmitScriptEvent` читает подписки `Scripts_EventHandler` по имени события, фильтрует `MetaFilter.IsMatch` в памяти и асинхронно выполняет `ScriptContext.Execute(meta, args)` в отдельном движке Jint с таймаутом `executionTimeout` (60 с по умолчанию); в сценарии доступны `host.api`, `host.scripts`, `host.log`, `host.emit`, константы `meta` и `args`.
5. Веб-интерфейс: `index.html` с import map → `main.js` → `GET /api/webui/meta` (разделы, язык, параметры хаба) → по маршруту подгружается ESM-бандл раздела, строки локализации из `GET /api/webui/lang?id=…`; ответы API валидируются схемами valibot на клиенте.
6. Состояние в БД: `Scripts_UserScript`, `Scripts_EventHandler`, `Cron_Task`, `TelegramChatList_Chat`; доступ только через `database.OpenSession()`.
7. Логи: Serilog в консоль и `logs/{Date}.log` (`ThinkingHome.Console/appsettings.json`); ошибки обработчиков ловит `EventContext` и пишет в лог плагина-владельца.

## Границы модулей

- `ThinkingHome.Core.Plugins` не знает о плагинах и инфраструктуре; `ThinkingHome.Core.Infrastructure` знает только о `ThinkingHome.Core.Plugins`.
- Плагин получает другой плагин только параметром конструктора (singleton в DI). Обратная связь (от владельца к подписчикам) — только через атрибуты-обработчики и `FindMethods`; владелец не ссылается на проекты подписчиков.
- Инфраструктурные плагины (`WebServer`, `WebUi`, `Database`, `Timer`, `Scripts`) не ссылаются на прикладные (`Cron`, `Mqtt`, `Mail`, `NooLite`, `TelegramBot`, `TelegramChatList`).
- Доступ к БД — только через `DatabasePlugin.OpenSession()`; свой `DbContext` и своё подключение плагины не создают.
- HTTP API и UI вынесены в отдельные проекты `.WebApi` и `.WebUi`; доменный плагин не ссылается на `WebServer` и `WebUi` (исключение — `ThinkingHome.Plugins.Tmp`).
- URL ресурсов подчиняются схеме `/api/{alias}/…`, `/dynamic/{alias}/….ext`, `/static/{alias}/…`, `/vendor/…`; нарушения перечисляет `/dynamic/web-server/url-validation/errors.txt`.
- Клиентские бандлы разделов не включают React, react-router, Mantine и @thinking-home/ui: они внешние (`SHARED_EXTERNALS`) и приходят из vendor-модулей хоста через import map.
- Имена сценарных событий, методов `[ScriptCommand]`, URL и топиков хаба — глобальные регистронезависимые ключи реестров; дубликат `ObjectRegistry` роняет старт приложения.

## Генерируемый код

| Что | Чем | Править руками |
|---|---|---|
| `Resources/app/**` в UI-проектах: бандлы `*.js`, предсжатые `*.js.gz` и `*.js.br`, `manifest.json`, `vendor/*` | `npm run build:development` или `build:production` из target `BuildClient*` в `.csproj` (`vite build` в WebUi, `th-build` в остальных) | нет; каталог игнорируется (`**/Resources/app/` в `.gitignore`) |
| `*/node_modules/.install-stamp` | target `NpmInstall` (`npm ci`) | нет |
| `package-lock.json` | npm | только через `npm install` |
| Схема БД | миграции `Migration01…` пишутся вручную на ThinkingHome.Migrator и применяются при старте; EF-миграций и scaffold нет | файлы миграций — да, схему в БД — нет |
| Описание выражения cron в ответах API | `CronExpressionDescriptor` на языке `CurrentUICulture` | нет |

Правило до устранения проблемы: `EmbeddedResource Include="Resources\**\*"` вычисляется до запуска `th-build`, поэтому при чистой сборке (после клонирования или удаления `Resources/app/**`) свежие бандлы не попадают в DLL с первого раза. Собирать дважды: `dotnet build ThinkingHome.sln` два раза подряд; проверять, что UI открывается, только после второй сборки.
