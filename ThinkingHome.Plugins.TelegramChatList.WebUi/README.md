*ThinkingHome.Plugins.TelegramChatList.WebUi*

# TelegramChatListWebUiPlugin

Добавляет в веб-интерфейс раздел для просмотра списка чатов Telegram, сохранённых плагином `ThinkingHome.Plugins.TelegramChatList`.

Данные плагин берет через [HTTP API списка чатов](../ThinkingHome.Plugins.TelegramChatList.WebApi), поэтому вместе с ним должен быть подключен плагин `ThinkingHome.Plugins.TelegramChatList.WebApi`.

## Разделы

### `/telegram-chat-list`

Таблица всех сохранённых чатов без пагинации, сортировки и фильтров. Для каждой записи отображаются поля `id`, `login`, `chatId`, `firstName`, `lastName` и `date`; незаполненные `login`, `firstName` и `lastName` показаны пустой ячейкой. Действий изменения и удаления записей раздел не предоставляет.

Если сохранённых чатов нет, вместо таблицы отображается сообщение об отсутствии записей. Если запрос списка завершается ошибкой, пользователю показывается уведомление об ошибке загрузки данных.
