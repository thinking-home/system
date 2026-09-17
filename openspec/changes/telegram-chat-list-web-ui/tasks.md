# Tasks

## 1. Проект плагина

- [x] 1.1 Создать проект `ThinkingHome.Plugins.TelegramChatList.WebUi` (по образцу `ThinkingHome.Plugins.Cron.WebUi`): `.csproj` с `ProjectReference` на `ThinkingHome.Core.Plugins`, `ThinkingHome.Plugins.WebServer`, `ThinkingHome.Plugins.WebUi`, таргетами сборки клиента (`NpmInstall`, `BuildClientDevelopment`/`BuildClientProduction`) и `EmbeddedResource` для `Resources/**/*`; проверить, что `dotnet build` находит и собирает проект.
- [x] 1.2 Добавить `package.json` (имя `@thinking-home/plugins-telegram-chat-list-web-ui`, `thPlugin.entries` со входом `list: frontend/list.tsx`, скрипты `build`/`build:development`/`build:production` через `th-build`, зависимости как в `ThinkingHome.Plugins.Cron.WebUi/package.json`) и `tsconfig.json`; проверить, что `npm install` завершается успешно.
- [x] 1.3 Добавить `ThinkingHome.Plugins.TelegramChatList.WebUi` в `assemblies` в `ThinkingHome.Console/appsettings.json` рядом с `ThinkingHome.Plugins.TelegramChatList.WebApi`; проверить, что плагин загружается при старте приложения (без ошибок в логе загрузки плагинов).
- [ ] 1.4 Добавить в корневой `README.md` (раздел «Плагины») строку про `ThinkingHome.Plugins.TelegramChatList.WebUi`, по формату и месту в списке (алфавитный порядок) как у соседних строк `ThinkingHome.Plugins.Cron.WebUi` и `ThinkingHome.Plugins.TelegramChatList.WebApi`; проверить, что строка присутствует и ссылка `./ThinkingHome.Plugins.TelegramChatList.WebUi` ведёт на созданный каталог плагина.

## 2. Серверная часть плагина

- [x] 2.1 Реализовать `TelegramChatListWebUiPlugin` с методом `[ConfigureWebUi]`, регистрирующим страницу `/telegram-chat-list` с бандлом `list.js` (по образцу `CronWebUiPlugin`); проверить, что после сборки по адресу `/telegram-chat-list` отдаётся HTML-документ веб-интерфейса.
- [x] 2.2 Добавить `Lang/TelegramChatListWebUiPlugin.resx` (тексты по умолчанию) и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` (перевод) для строк раздела; проверить, что `/api/webui/lang?id=<langId>` раздела возвращает оба набора строк.

## 3. Клиентская часть: список чатов

- [x] 3.1 Добавить `frontend/api.ts` с обращением к `/api/telegram-chat-list/web-api/list` через `ApiClient` и валидацией ответа схемой (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`, с учётом что `login`/`firstName`/`lastName` могут быть `null`); проверить типами (`tsc --noEmit` или сборка) соответствие полей `plugins/telegram-chat-list/http-api`.
- [x] 3.2 Добавить `frontend/lang.ts` с ключами локализации раздела (заголовок, заголовки колонок, состояние пустого списка, сообщение об ошибке загрузки), синхронизированными со строками из `Lang/*.resx`.
- [x] 3.3 Реализовать `frontend/list.tsx` — компонент раздела: загружает список через `frontend/api.ts` и отображает таблицу со всеми полями (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`), без пагинации и без элементов фильтрации; пустые `login`/`firstName`/`lastName` отображаются как пустое значение; ошибка загрузки показывается через уведомления из контекста приложения. Проверить вручную (`npm run build` + запуск приложения): страница `/telegram-chat-list` показывает все записи и все поля из ответа API.

## 4. Ссылка на главной странице

- [x] 4.1 В `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, компонент `Home`, добавить пункт списка со ссылкой на `/telegram-chat-list` (по аналогии с существующими пунктами `Scripts` и `Schedule`); проверить вручную, что ссылка на главной странице открывает раздел `/telegram-chat-list`.

## 5. Итоговая проверка

- [x] 5.1 Собрать решение (`dotnet build`) и убедиться, что сборка проходит без ошибок для всех затронутых проектов.
- [x] 5.2 Запустить приложение, открыть `/` и через добавленную ссылку перейти на `/telegram-chat-list`; убедиться, что список отображает все существующие записи таблицы `TelegramChatList_Chat` со всеми полями, без пагинации и фильтров.
