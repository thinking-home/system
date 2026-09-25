---
id: project.glossary
summary: Термины ThinkingHome (плагин, обработчик, реестр, сценарий, сценарное событие, meta, подписка, HTTP-ресурс, раздел, шина сообщений, запись расписания и др.) с привязкой к коду
read_when: При написании спецификаций, тестов и сообщений пользователю
updated: 2026-09-14
verification: needs-review
---

# Словарь домена

## Термины

| Термин | Определение | Где в коде |
|---|---|---|
| Плагин | класс-наследник `PluginBase`, единица расширения; создаётся DI как singleton при старте из сборок списка `assemblies` | `ThinkingHome.Core.Plugins/PluginBase.cs`, `ThinkingHome.Core.Infrastructure/HomeApplication.cs` |
| Хост, хост-приложение | процесс `ThinkingHome.Console`, который загружает и останавливает плагины | `ThinkingHome.Console/Program.cs` |
| Контекст сервисов | объект `IServiceContext`, даёт список всех плагинов в прямом или обратном порядке | `ThinkingHome.Core.Infrastructure/ServiceContext.cs` |
| Индекс зависимости | `DependencyIndex`, порядок создания экземпляра плагина; задаёт порядок init/start и обратный порядок stop | `ThinkingHome.Core.Plugins/PluginBase.cs` |
| Жизненный цикл плагина | стадии `InitPlugin`, `StartPlugin`, `StopPlugin` | `ThinkingHome.Core.Plugins/PluginBase.cs` |
| Секция конфигурации плагина | узел `plugins:{FullName}` из `appsettings.json`, доступен как `Configuration` | `ThinkingHome.Core.Infrastructure/HomeConfiguration.cs` |
| Атрибут-обработчик, обработчик | публичный метод плагина, помеченный атрибутом (`[TimerCallback]`, `[CronHandler]`, `[ScriptCommand]`, `[TelegramMessageHandler]`, `[NooLiteCommandHandler]`) и найденный владельцем через `FindMethods` | `ThinkingHome.Core.Plugins/Utils/Extensions.cs` |
| Метод конфигурации, билдер | метод с атрибутом `[Configure…]` (`ConfigureWebServer`, `ConfigureWebUi`, `ConfigureScriptEvents`, `ConfigureMqtt`), получающий билдер `…ConfigurationBuilder`; после `Dispose` билдера регистрация запрещена | `ThinkingHome.Core.Plugins/Utils/BaseConfigurationBuilder.cs` |
| Безопасный вызов | `SafeInvoke` и `SafeInvokeAsync`: вызов обработчиков с изоляцией ошибок и записью в лог | `ThinkingHome.Core.Plugins/EventContext.cs` |
| Реестр | потокобезопасное хранилище ключ-значение с регистронезависимыми ключами: `ObjectRegistry` (один объект на ключ, дубликат — ошибка) и `ObjectSetRegistry` (список на ключ, copy-on-write) | `ThinkingHome.Core.Plugins/Utils/BaseRegistry.cs` |
| Сессия БД | `DbContext`, открытый через `DatabasePlugin.OpenSession()`; модель собирается из методов `[DbModelBuilder]` всех плагинов | `ThinkingHome.Plugins.Database/DatabasePlugin.cs` |
| Миграция | класс `Migration` с `[Migration(N)]` в сборке плагина, применяется при старте на PostgreSQL | `ThinkingHome.Plugins.Scripts/Model/Migrations` |
| Сценарий | пользовательская программа на JavaScript, хранится как `UserScript` (таблица `Scripts_UserScript`), выполняется движком Jint | `ThinkingHome.Plugins.Scripts/Model/UserScript.cs`, `ThinkingHome.Plugins.Scripts/Internal/ScriptContext.cs` |
| Объект host | глобальный объект сценария: `host.api` (методы плагинов), `host.scripts` (другие сценарии по имени), `host.log`, `host.emit` | `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs` |
| Сценарная команда, метод плагина | метод с `[ScriptCommand("alias")]`, доступный сценарию как `host.api.alias` | `ThinkingHome.Plugins.Scripts/Attributes/ScriptCommandAttribute.cs` |
| args | константа сценария с аргументами: массив при прямом запуске, параметры события в обработчике | `ThinkingHome.Plugins.Scripts/Internal/ScriptContext.cs` |
| meta | словарь строк «ключ-значение» события, доступный сценарию как константа `meta`; `undefined` вне события | `ThinkingHome.Plugins.Scripts/Internal/ScriptContext.cs` |
| Сценарное событие | именованное событие плагина, зарегистрированное через `RegisterEvent(name)`; имена уникальны без учёта регистра | `ThinkingHome.Plugins.Scripts/Events/ScriptEventDefinition.cs` |
| Emitter | делегат, возвращаемый `RegisterEvent`; его вызов инициирует событие с параметрами и meta | `ThinkingHome.Plugins.Scripts/Events/ScriptEventEmitter.cs` |
| Пользовательское событие | событие `scripts:user-event` с произвольным именем в `meta.name`; порождается `EmitUserEvent`, `host.emit`, записями cron, секцией `scriptEvents` MQTT | `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs` |
| Подписка | связь сценария с событием, запись `ScriptEventHandler` (таблица `Scripts_EventHandler`) с необязательным фильтром | `ThinkingHome.Plugins.Scripts/Model/ScriptEventHandler.cs` |
| Фильтр по meta | строка в формате query string с отсортированными URL-кодированными парами; подписка срабатывает, если все пары есть в meta события; пустой фильтр пропускает всё | `ThinkingHome.Plugins.Scripts/Events/MetaFilter.cs` |
| Таймаут сценария | `executionTimeout` в секундах, по умолчанию 60; 0 отключает | `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs` |
| Buffer | обёртка над байтами для сценариев: `ToUtf8String`, `ToBase64String`, `GetBytes` | `ThinkingHome.Plugins.Scripts/Buffer.cs` |
| Колбэк таймера | метод с `[TimerCallback(interval, delay)]`, получает текущее время; первый запуск со случайной задержкой, если `delay` не задан | `ThinkingHome.Plugins.Timer/TimerCallbackAttribute.cs` |
| Запись расписания | `CronTask` (таблица `Cron_Task`): имя, выражение cron из пяти сегментов, имя пользовательского события, флаг `Enabled` | `ThinkingHome.Plugins.Cron/Model/CronTask.cs` |
| Выражение cron | строка `минута час день месяц день-недели`, разбирается NCrontab | `ThinkingHome.Plugins.Cron/CronScheduleItem.cs` |
| Окно активных запусков | при проверке раз в 20 с выполняются запуски, наступившие не более 5 минут назад | `ThinkingHome.Plugins.Cron/CronPlugin.cs` |
| Обработчик cron | метод с `[CronHandler]`, получает id сработавшей записи | `ThinkingHome.Plugins.Cron/CronHandlerAttribute.cs` |
| HTTP-ресурс | URL, зарегистрированный плагином: статический (файл из ресурсов DLL, кэшируется) или динамический (делегат, возвращающий `HttpHandlerResult`) | `ThinkingHome.Plugins.WebServer/WebServerConfigurationBuilder.cs` |
| Предсжатый ресурс | `StaticResource` с путями к исходному файлу и копиям `.gz` и `.br`; вариант выбирается по `Accept-Encoding` | `ThinkingHome.Plugins.WebServer/Handlers/StaticResource.cs` |
| Параметры запроса | `HttpRequestParams`: значения из query string и form, методы `GetString`, `GetRequiredGuid` и т. п.; отсутствие обязательного → 400 | `ThinkingHome.Plugins.WebServer/Handlers/HttpRequestParams.cs` |
| Plugin alias | имя пакета без `ThinkingHome.Plugins.`, camelCase → дефис, точки → слэш, нижний регистр; основа URL | `ThinkingHome.Plugins.WebServer.UrlValidation/UrlValidationPlugin.cs` |
| Шина сообщений | SignalR hub `/hub`: топики, серверный метод `Send`, клиентский `serverMessage`, локальные обработчики топиков | `ThinkingHome.Plugins.WebServer/Messages/MessageHub.cs` |
| Топик | имя канала шины сообщений или MQTT | `ThinkingHome.Plugins.WebServer/Messages/MessageHub.cs`, `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs` |
| Раздел веб-интерфейса, страница | URL и ESM-бандл, зарегистрированные через `RegisterPage`; описан `WebUiPageDefinition` | `ThinkingHome.Plugins.WebUi/WebUiConfigurationBuilder.cs` |
| Оболочка | клиент `main.js`: грузит метаданные, роутинг, тему Mantine, уведомления, подключение к шине | `ThinkingHome.Plugins.WebUi/frontend/index.tsx` |
| Модуль раздела | результат `createModule(Component)` из @thinking-home/ui, экспорт по умолчанию из файла точки входа | `ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx` |
| Vendor-модули, import map | предсобранные React, react-router, Mantine, @thinking-home/ui из пакета @thinking-home/ui, раздаются с `/static/webui/vendor/` и подставляются в `index.html` | `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs` |
| Языковой пакет | строки плагина из `Lang/*.resx`, отдаются клиенту по `langId` через `/api/webui/lang`; на клиенте `Keyset` и `useKeyset` | `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs`, `ThinkingHome.Plugins.Scripts.WebUi/frontend/lang.ts` |
| Слушатель MQTT | пара «фильтр топика → обработчик», зарегистрированная через `RegisterListener`; подписки на брокере ставятся при подключении | `ThinkingHome.Plugins.Mqtt/DynamicConfiguration/MqttConfigurationBuilder.cs` |
| scriptEvents (MQTT) | секция конфигурации «фильтр топика → имя пользовательского события»; в meta приходят `name` и `topic` | `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs` |
| Адаптер nooLite, канал | устройство MTRF-64 на serial-порту и номер канала нагрузки; `AdapterWrapper` даёт `On`, `Off`, `SetBrightness` | `ThinkingHome.Plugins.NooLite/AdapterWrapper.cs` |
| Данные микроклимата | температура, влажность, батарея с датчика nooLite; событие `noolite:microclimate-data:received` | `ThinkingHome.Plugins.NooLite/NooLiteMicroclimateEventArgs.cs` |
| Команда бота | первое слово сообщения после `/` из латиницы, цифр, дефиса и подчёркивания; обработчики по команде и «на все команды» | `ThinkingHome.Plugins.TelegramBot/TelegramBotPlugin.cs` |
| Авторизованные логины | `authorizedLogins`: только их сообщения в личных чатах доходят до обработчиков команд | `ThinkingHome.Plugins.TelegramBot/TelegramBotPlugin.cs` |
| Чат | запись `Chat` (таблица `TelegramChatList_Chat`) о собеседнике бота, обновляется при каждом сообщении | `ThinkingHome.Plugins.TelegramChatList/Model/Chat.cs` |
| Capability | единица спецификации OpenSpec `openspec/specs/{id}/spec.md` с требованиями и сценариями | `openspec/specs` |
