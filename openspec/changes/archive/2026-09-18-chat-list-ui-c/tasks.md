## 1. Каркас проекта

- [x] 1.1 Техническая: создать проект `ThinkingHome.Plugins.TelegramChatList.WebUi` с csproj по образцу `ThinkingHome.Plugins.Cron.WebUi.csproj` (импорт `Package.xml`, `net10.0`, таргеты `NpmInstall`/`BuildClientDevelopment`/`BuildClientProduction`, `EmbeddedResource Resources\**\*`, ссылки на `Core.Plugins`, `WebServer`, `WebUi`) — D1
- [x] 1.2 Техническая: добавить `package.json` (entry `chats` → `frontend/chats.tsx`, зависимости и скрипты как в образце) и `tsconfig.json` — D2
- [x] 1.3 Техническая: зарегистрировать проект в `ThinkingHome.sln`

## 2. Серверная часть плагина

- [x] 2.1 Реализовать `TelegramChatListWebUiPlugin` с `[ConfigureWebUi]` и `RegisterPage("/telegram-chat-list", Bundle("chats.js"))` (с предсжатыми копиями) — «Раздел списка чатов», D2
- [x] 2.2 Добавить ресурсы `Lang/TelegramChatListWebUiPlugin.resx` и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` с переводами подписей раздела — «Локализация подписей раздела»

## 3. Клиентская часть раздела

- [x] 3.1 Написать `frontend/api.ts`: valibot-схема ответа списка чатов и запрос `api.get` к `/api/telegram-chat-list/web-api/list` — «Зависимость от HTTP API списка чатов»
- [x] 3.2 Написать `frontend/lang.ts`: keyset `en` с ключами `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad` — «Локализация подписей раздела»
- [x] 3.3 Написать `frontend/chats.tsx`: загрузка списка в `useEffect` с `AbortController`, таблица со всеми шестью полями, пустые ячейки для `null` — «Раздел списка чатов», D3, D4
- [x] 3.4 Добавить в `frontend/chats.tsx` ветку пустого списка и обработку ошибки загрузки через `toaster`/`logger` — «Пустой список и ошибка загрузки», D5

## 4. Интеграция в приложение

- [x] 4.1 Добавить сборку `ThinkingHome.Plugins.TelegramChatList.WebUi` в `assemblies` в `ThinkingHome.Console/appsettings.json` — «Зависимость от HTTP API списка чатов»
- [x] 4.2 Добавить пункт со ссылкой на `/telegram-chat-list` в список разделов компонента `Home` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — «Переход в раздел с корневой страницы»
- [x] 4.3 Техническая: добавить `README.md` нового проекта с описанием раздела и его зависимости от HTTP API

## 5. Проверки

- [x] 5.1 Прогнать `npx tsc -p tsconfig.json` в каталоге `ThinkingHome.Plugins.TelegramChatList.WebUi`
- [x] 5.2 Прогнать `dotnet build ThinkingHome.sln` (дважды при первой сборке — см. `architecture.md`)
- [x] 5.3 Прогнать `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj`
- [x] 5.4 Прогнать тесты из `coverage.yaml`, если они появятся для capability `plugins/telegram-chat-list/web-ui`
