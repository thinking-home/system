*ThinkingHome.Plugins.TelegramChatList.WebUi*

# TelegramChatListWebUiPlugin

Добавляет в веб-интерфейс раздел для просмотра списка чатов с Telegram ботом, сохраненных плагином [TelegramChatList](../ThinkingHome.Plugins.TelegramChatList).

Данные плагин берет через [HTTP API списка чатов](../ThinkingHome.Plugins.TelegramChatList.WebApi), поэтому вместе с ним должен быть подключен плагин `ThinkingHome.Plugins.TelegramChatList.WebApi`. К базе данных раздел не обращается.

## Разделы

### `/telegram-chat-list`

Список сохраненных чатов, доступный только для чтения: добавлять, редактировать и удалять записи в разделе нельзя.

Для каждого чата в таблице выводятся все поля записи: `id`, `login`, `chatId`, `firstName`, `lastName` и `date`. Дата показывается в формате языка интерфейса; если `login`, `firstName` или `lastName` не заполнены, в ячейке выводится прочерк.

Записи идут по убыванию даты (самый свежий чат — первым). Порядок обеспечивает [HTTP API](../ThinkingHome.Plugins.TelegramChatList.WebApi/README.md#apitelegram-chat-listweb-apilist): раздел выводит записи в том порядке, в котором они пришли в ответе, и не дает средств его изменить.

Если сохраненных чатов нет, вместо таблицы выводится сообщение «Чатов пока нет». Если запрос к API завершился ошибкой, список не отображается, а пользователю показывается уведомление об ошибке загрузки.
