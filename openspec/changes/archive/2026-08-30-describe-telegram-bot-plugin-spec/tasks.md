## 1. plugins/telegram-bot/inbound-message-handling

- [x] 1.1 Сверить требования спецификации `specs/plugins/telegram-bot/inbound-message-handling/spec.md` с `ThinkingHome.Plugins.TelegramBot/TelegramBotPlugin.cs`, `TelegramMessageHandlerAttribute.cs`, `TelegramMessageHandlerDelegate.cs` и `README.md`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/telegram-bot/outbound-messaging

- [x] 2.1 Сверить требования спецификации `specs/plugins/telegram-bot/outbound-messaging/spec.md` с `ThinkingHome.Plugins.TelegramBot/TelegramBotPlugin.cs` (методы `SendMessage`, `SendPhoto`, `SendFile`, `Try`) и `README.md`; убедиться, что нет расхождений с текущим поведением

## 3. Завершение

- [x] 3.1 Прогнать `npx openspec validate describe-telegram-bot-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
