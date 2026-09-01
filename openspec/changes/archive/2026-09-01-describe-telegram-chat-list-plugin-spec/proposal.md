## Why

Продолжается описание спецификаций OpenSpec для существующего кода. Следующий по очереди (в порядке использования, без незакрытых зависимостей) — плагин TelegramChatList вместе со спутником TelegramChatList.WebApi.

## What Changes

- Задокументировать поведение `ThinkingHome.Plugins.TelegramChatList`: сохранение/обновление записи о чате Telegram при получении сообщения от бота (ID чата, логин, имя, фамилия, дата последнего сообщения), таблица `TelegramChatList_Chat` и уникальность по `ChatId`.
- Задокументировать HTTP API `ThinkingHome.Plugins.TelegramChatList.WebApi`: эндпоинт `GET /api/telegram-chat-list/web-api/list`, возвращающий список сохранённых чатов.

## Capabilities

### New Capabilities
- `plugins/telegram-chat-list/chat-tracking`: сохранение и обновление данных о чатах Telegram при получении входящих сообщений через `TelegramBotPlugin`.
- `plugins/telegram-chat-list/http-api`: HTTP-эндпоинт для получения списка сохранённых чатов.

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.TelegramChatList/*` (плагин, модель `Chat`, миграция `Migration01`).
- `ThinkingHome.Plugins.TelegramChatList.WebApi/*` (плагин HTTP API).
- Зависимости: `plugins/telegram-bot/inbound-message-handling` (событие `OnMessageReceived`), `plugins/database/*` (хранение и миграции), `plugins/web-server/http-resources` (регистрация HTTP-ресурса).
