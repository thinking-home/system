*ThinkingHome.Plugins.TelegramChatList*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.TelegramChatList.svg)]()

# TelegramChatListPlugin

Сохраняет в базу данных информацию о чатах Telegram бота. В базу данных сохраняются ID чата, логин (username), имя, фамилия и дата последнего принятого сообщения.

## Данные

### `ThinkingHome.Plugins.TelegramChatList.Model.Chat`

Представляет собой сохраненную информацию об одном чате. Вы можете работать с ней с помощью плагина [DatabasePlugin](../ThinkingHome.Plugins.Database/README.md) и [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core).

Таблица: `TelegramChatList_Chat`

Поля:

- `Guid Id` - id записи.
- `long ChatId` - ID чата в Telegram.
- `string? Login` - логин (username) собеседника; может отсутствовать.
- `string? FirstName` - имя собеседника; может отсутствовать.
- `string? LastName` - фамилия собеседника; может отсутствовать.
- `DateTime Date` - дата последнего принятого сообщения.
