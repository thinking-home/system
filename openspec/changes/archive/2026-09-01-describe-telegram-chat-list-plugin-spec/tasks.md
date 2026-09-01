## 1. plugins/telegram-chat-list/chat-tracking

- [x] 1.1 Сверить требования спецификации `specs/plugins/telegram-chat-list/chat-tracking/spec.md` с `ThinkingHome.Plugins.TelegramChatList/TelegramChatListPlugin.cs`, `Model/Chat.cs` и `Model/Migrations/Migration01.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/telegram-chat-list/http-api

- [x] 2.1 Сверить требования спецификации `specs/plugins/telegram-chat-list/http-api/spec.md` с `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 3. Завершение

- [x] 3.1 Прогнать `npx openspec validate describe-telegram-chat-list-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
