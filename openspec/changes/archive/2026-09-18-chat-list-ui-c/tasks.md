## 1. Сортировка в HTTP API

- [x] 1.1 Добавить в запрос списка чатов `TelegramChatListWebApiPlugin.GetChatList` упорядочивание по `Date` по убыванию до материализации (требование «Список сохранённых чатов», сценарий «Порядок записей в ответе», D2)

## 2. Каркас проекта раздела

- [x] 2.1 Создать проект `ThinkingHome.Plugins.TelegramChatList.WebUi` с `.csproj` по образцу `ThinkingHome.Plugins.Cron.WebUi.csproj` (импорт `Package.xml`, цели npm-сборки, `EmbeddedResource` для `Resources\**\*`, ссылки на `Core.Plugins`, `WebServer`, `WebUi`) — техническая
- [x] 2.2 Добавить `package.json` (`thPlugin.entries: {chats: "frontend/chats.tsx"}`, скрипты `build*`, зависимости как у образца) и `tsconfig.json` — техническая
- [x] 2.3 Добавить `TelegramChatListWebUiPlugin` с `[ConfigureWebUi]` и `RegisterPage("/telegram-chat-list", Bundle("chats.js"))` (требование «Раздел списка чатов», D1)

## 3. Клиентская часть раздела

- [x] 3.1 `frontend/api.ts`: valibot-схема списка чатов со всеми полями ответа и функция запроса `/api/telegram-chat-list/web-api/list` через `ApiClient` (требование «Зависимость от HTTP API списка чатов»)
- [x] 3.2 `frontend/lang.ts`: `Keyset('en', …)` с заголовком раздела, подписями столбцов, текстом пустого списка и текстом ошибки загрузки (требование «Отображение незаданных значений и пустого списка») — техническая
- [x] 3.3 `frontend/chats.tsx`: загрузка списка в `useEffect` с `AbortController`, `createModule`, `useAppContext`, `useKeyset`; таблица со всеми полями записи в порядке ответа API, без действий изменения (требование «Раздел списка чатов»)
- [x] 3.4 Прочерк в ячейках для `null`-значений `login`, `firstName`, `lastName` и сообщение вместо таблицы при пустом списке (требование «Отображение незаданных значений и пустого списка»)
- [x] 3.5 Уведомление об ошибке через `toaster.showError` с записью в логгер, без отображения таблицы; отмена запроса ошибкой не считается (требование «Ошибка загрузки списка чатов», D3)
- [x] 3.6 Отображение `date` локальным форматом браузера (D4)

## 4. Локализация

- [x] 4.1 Добавить `Lang/TelegramChatListWebUiPlugin.resx` (английский) и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` (русский) с ключами из `lang.ts` — техническая

## 5. Подключение модуля

- [x] 5.1 Добавить проект раздела в `ThinkingHome.sln` — техническая
- [x] 5.2 Добавить `ProjectReference` на проект раздела в `ThinkingHome.Console/ThinkingHome.Console.csproj` — техническая
- [x] 5.3 Добавить сборку раздела в список `assemblies` в `ThinkingHome.Console/appsettings.json` — техническая
- [x] 5.4 Добавить ссылку на `/telegram-chat-list` в список разделов `Home` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (требование «Ссылка на раздел списка чатов на корневой странице», D1)
- [x] 5.5 Добавить строку о новом плагине в список плагинов в `README.md` репозитория и написать `README.md` проекта раздела — техническая

## 6. Проверки

- [x] 6.1 Прогнать тесты из coverage.yaml, если они заданы, иначе `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — техническая
- [x] 6.2 Проверить типы раздела: `npx tsc -p tsconfig.json` в каталоге `ThinkingHome.Plugins.TelegramChatList.WebUi` — техническая
- [x] 6.3 Собрать решение `dotnet build ThinkingHome.sln` (при чистой сборке дважды, см. `architecture.md`) — техническая
