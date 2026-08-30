*ThinkingHome.Plugins.TelegramChatList.WebApi*

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.TelegramChatList.WebApi.svg)](https://www.nuget.org/packages/ThinkingHome.Plugins.TelegramChatList.WebApi)

# TelegramChatListWebApiPlugin

Предоставляет HTTP API для просмотра списка сохраненных чатов из
плагина [TelegramChatList](../ThinkingHome.Plugins.TelegramChatList).

## HTTP API

### `/api/telegram-chat-list/web-api/list`

Возвращает список чатов с ботом, сохраненных в системе.

#### Параметры и возвращаемое значение

Для этого запроса не нужно передавать никаких параметров.

В ответ на клиент возвращается список чатов.

```js
[
    {
        "id": "779edb64-6336-4c48-b800-659de94e2931",
        "login": "kyleBroflovsky",
        "chatId": 1234567890,
        "firstName": "Кайл",
        "lastName": "Брофловски",
        "date": "2025-07-11T23:40:15"
    },
    {
        "id": "b1f28810-a0d4-4d1a-9d38-8838c84d169c",
        "chatId": 1987654321,
        "firstName": "Кенни",
        "lastName": null,
        "login": null,
        "date": "2025-07-11T23:40:50"
    }
]
```

#### Пример

```bash
curl 'http://localhost:8080/api/telegram-chat-list/web-api/list'
```