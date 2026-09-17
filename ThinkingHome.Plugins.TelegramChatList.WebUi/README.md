*ThinkingHome.Plugins.TelegramChatList.WebUi*

# TelegramChatListWebUiPlugin

Добавляет в веб-интерфейс раздел для просмотра списка чатов Telegram.

Данные плагин берет через [HTTP API списка чатов](../ThinkingHome.Plugins.TelegramChatList.WebApi), поэтому вместе с ним должен быть подключен плагин `ThinkingHome.Plugins.TelegramChatList.WebApi`.

## Разделы

### `/telegram-chat-list`

Список сохраненных чатов: таблица со всеми записями, каждая — с полями `id`, `login`, `chatId`, `firstName`, `lastName` и `date`.

Раздел предназначен только для чтения: действий над записями, пагинации и фильтров в нем нет. Поля `login`, `firstName` и `lastName` Telegram передает не всегда — для таких записей ячейки остаются пустыми.
