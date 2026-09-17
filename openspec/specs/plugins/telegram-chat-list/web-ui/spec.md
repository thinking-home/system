# plugins/telegram-chat-list/web-ui Specification

## Purpose
Добавляет в веб-интерфейс раздел для просмотра списка чатов Telegram, сохранённых контрактом `plugins/telegram-chat-list/chat-tracking`, использующий HTTP API `plugins/telegram-chat-list/http-api`.

## Requirements

### Requirement: Источник данных
`TelegramChatList.WebUi` SHALL получать список чатов через HTTP API `plugins/telegram-chat-list/http-api`; для корректной работы раздела `TelegramChatList.WebUi` SHALL быть подключён вместе с плагином, предоставляющим этот API.

#### Scenario: Данные запрашиваются через HTTP API
- **WHEN** пользователь открывает раздел `TelegramChatList.WebUi`
- **THEN** данные для раздела запрашиваются через HTTP API `/api/telegram-chat-list/web-api/list`

### Requirement: Список чатов
Страница `/telegram-chat-list` SHALL отображать список всех записей о чатах, возвращённых `/api/telegram-chat-list/web-api/list`, в виде таблицы, где каждая запись представлена всеми полями, возвращаемыми API (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`). Раздел SHALL не содержать пагинации и фильтров.

#### Scenario: Отображение всех полей всех записей
- **WHEN** пользователь открывает `/telegram-chat-list`
- **THEN** отображается таблица со всеми записями, возвращёнными API, каждая — со значениями полей `id`, `login`, `chatId`, `firstName`, `lastName` и `date`
- **AND** список отображается целиком, без пагинации и без элементов фильтрации
