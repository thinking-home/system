## Why

Плагин `NooLite` (следующий по очереди после `Mqtt`, перед `TelegramChatList`, `WebUi` и `Tmp`) пока не описан спецификацией. Он предоставляет управление освещением и электроприборами по радиоканалу nooLite/nooLite-F через адаптер MTRF-64-USB: отправку команд из плагинов и сценариев, приём команд/данных микроклимата от устройств и декларативную регистрацию обработчиков в других плагинах.

## What Changes

- Добавить спецификацию капабилити `plugins/noolite/device-connection`: конфигурация serial-порта адаптера (`portName`, обязателен), жизненный цикл адаптера (открытие при старте, закрытие при остановке, периодическая попытка переподключения по таймеру), логирование подключения/отключения/ошибок адаптера.
- Добавить спецификацию капабилити `plugins/noolite/data-handlers`: декларативная регистрация обработчиков входящих данных другими плагинами через атрибуты `[NooLiteCommandHandler]` и `[NooLiteMicroclimateDataHandler]`, вызов зарегистрированных обработчиков при получении команды/данных микроклимата от адаптера.
- Добавить спецификацию капабилити `plugins/noolite/adapter-control`: API отправки команд адаптеру (`AdapterWrapper`/`Open(fMode)`) — включение/выключение нагрузки, установка яркости, временное включение, управление цветом RGB-ленты, применение сценария освещения; выбор режима nooLite/nooLite-F; обработка ошибок отправки; доступность API для плагинов и для сценариев (скриптовая команда `noolite`).
- Добавить спецификацию капабилити `plugins/noolite/script-events`: сценарные события `noolite:data:received` и `noolite:microclimate-data:received`, регистрируемые при наличии плагина `Scripts`, их параметры (`args`) и метаданные фильтрации (`meta`).

## Capabilities

### New Capabilities
- `plugins/noolite/device-connection`: конфигурация подключения к адаптеру nooLite, жизненный цикл адаптера, переподключение по таймеру, логирование состояния соединения
- `plugins/noolite/data-handlers`: декларативная регистрация обработчиков входящих команд и данных микроклимата (`[NooLiteCommandHandler]`, `[NooLiteMicroclimateDataHandler]`) и их вызов при получении данных от адаптера
- `plugins/noolite/adapter-control`: API управления нагрузкой и RGB-лентой через адаптер nooLite/nooLite-F, доступное плагинам и сценариям
- `plugins/noolite/script-events`: сценарные события о получении команды и данных микроклимата от адаптера nooLite

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs`
- `ThinkingHome.Plugins.NooLite/AdapterWrapper.cs`
- `ThinkingHome.Plugins.NooLite/NooLiteCommandHandlerAttribute.cs`, `NooLiteCommandHandlerDelegate.cs`
- `ThinkingHome.Plugins.NooLite/NooLiteMicroclimateDataHandlerAttribute.cs`, `NooLiteMicroclimateDataHandlerDelegate.cs`
- `ThinkingHome.Plugins.NooLite/NooLiteDataEventArgs.cs`, `NooLiteMicroclimateEventArgs.cs`
- Новые спецификации: `openspec/specs/plugins/noolite/device-connection/spec.md`, `openspec/specs/plugins/noolite/data-handlers/spec.md`, `openspec/specs/plugins/noolite/adapter-control/spec.md`, `openspec/specs/plugins/noolite/script-events/spec.md`
