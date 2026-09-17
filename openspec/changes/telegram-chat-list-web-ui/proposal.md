# Proposal

## Why

Плагин `plugins/telegram-chat-list/http-api` уже предоставляет данные о чатах Telegram через HTTP API, но у них нет представления в веб-интерфейсе — просмотреть список чатов можно только напрямую через API.

## What Changes

- Добавляется новый плагин веб-интерфейса, отображающий список чатов Telegram (все поля записи) на отдельной странице, без пагинации и фильтров.
- На главной странице веб-интерфейса добавляется ссылка на этот раздел (по аналогии с уже существующими ссылками на разделы `Scripts` и `Schedule`).

## Capabilities

### New Capabilities
- `plugins/telegram-chat-list/web-ui`: раздел веб-интерфейса, отображающий полный список записей о чатах Telegram (все поля таблицы `TelegramChatList_Chat`), полученных через `plugins/telegram-chat-list/http-api`, без пагинации и фильтров.

### Modified Capabilities
- (нет — раздел использует существующий HTTP API без изменения его контракта)

## Impact

- Новый проект плагина веб-интерфейса (по аналогии с `ThinkingHome.Plugins.Cron.WebUi` / `ThinkingHome.Plugins.Scripts.WebUi`), использующий `plugins/web-ui/page-registration` для регистрации страницы и `plugins/telegram-chat-list/http-api` как источник данных.
- Изменение конфигурации сборки/запуска (`ThinkingHome.Console/appsettings.json` и т. п.) для подключения нового плагина.
- Изменение главной страницы веб-интерфейса (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, компонент `Home`) — добавление ссылки на новый раздел.
