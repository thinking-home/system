## Why

Текущий код проекта описывается спецификациями OpenSpec поэтапно, по одному изменению на плагин. Плагин `ThinkingHome.Plugins.TelegramBot` реализован и задокументирован в README, но не имеет формальной спецификации в `openspec/specs`.

## What Changes

- Описать спецификациями текущее поведение плагина `ThinkingHome.Plugins.TelegramBot`:
  - приём и авторизация входящих сообщений Telegram, диспетчеризация в обработчики плагинов (событие `OnMessageReceived` и обработчики `[TelegramMessageHandler]`);
  - отправка исходящих сообщений, фото и файлов ботом.
- Новых требований к поведению плагина не вводится — фиксируется уже реализованный контракт.

## Capabilities

### New Capabilities
- `plugins/telegram-bot/inbound-message-handling`: приём обновлений от Telegram, авторизация по `authorizedLogins`, разбор команды из текста сообщения, событие `OnMessageReceived` и диспетчеризация в обработчики `[TelegramMessageHandler]`.
- `plugins/telegram-bot/outbound-messaging`: отправка ботом текстовых сообщений, фото и файлов в чат по `chatId`.

### Modified Capabilities
(нет)

## Impact

- Затрагиваемый код: `ThinkingHome.Plugins.TelegramBot` (`TelegramBotPlugin.cs`, `TelegramMessageHandlerAttribute.cs`, `TelegramMessageHandlerDelegate.cs`).
- Новые файлы спецификаций: `openspec/specs/plugins/telegram-bot/inbound-message-handling/spec.md`, `openspec/specs/plugins/telegram-bot/outbound-messaging/spec.md`.
- Зависимости: плагин использует базовые механизмы ядра (`core/plugin-model`, `core/object-registry`), уже описанные ранее; сторонняя библиотека `Telegram.Bot`.
