# Реализация — chat-list-ui-c (implementer, run r6)

## Сводка

- Добавлена сортировка `OrderByDescending(x => x.Date)` в `TelegramChatListWebApiPlugin.GetChatList` (`ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`) до материализации списка — требование «Список сохранённых чатов», решение D2.
- Создан новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` по образцу `ThinkingHome.Plugins.Cron.WebUi`: `.csproj`, `package.json`, `tsconfig.json`, `TelegramChatListWebUiPlugin.cs` (регистрация `/telegram-chat-list`, бандл `chats.js`), клиентская часть `frontend/api.ts`, `frontend/lang.ts`, `frontend/chats.tsx` (таблица только для чтения, прочерк для `null`-полей, сообщение о пустом списке, уведомление об ошибке через `toaster.showError` с логированием, дата — локальным форматом браузера через `toLocaleString()`), локализация `Lang/TelegramChatListWebUiPlugin.resx` и `.ru-RU.resx`, `README.md` проекта.
- Подключение раздела: запись в `ThinkingHome.sln`, `ProjectReference` в `ThinkingHome.Console/ThinkingHome.Console.csproj`, элемент `assemblies` в `ThinkingHome.Console/appsettings.json`, ссылка на `/telegram-chat-list` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, строка в списке плагинов `README.md` репозитория.
- Все задачи `tasks.md` отмечены `- [x]`.

## Изменённые/добавленные файлы

- `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`
- `ThinkingHome.Plugins.TelegramChatList.WebUi/` (новый проект: `ThinkingHome.Plugins.TelegramChatList.WebUi.csproj`, `package.json`, `tsconfig.json`, `TelegramChatListWebUiPlugin.cs`, `frontend/api.ts`, `frontend/lang.ts`, `frontend/chats.tsx`, `Lang/TelegramChatListWebUiPlugin.resx`, `Lang/TelegramChatListWebUiPlugin.ru-RU.resx`, `README.md`)
- `ThinkingHome.sln`
- `ThinkingHome.Console/ThinkingHome.Console.csproj`
- `ThinkingHome.Console/appsettings.json`
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`
- `README.md`
- `openspec/changes/chat-list-ui-c/tasks.md` (только отметки `- [x]`)

Защищённые файлы (тесты) не изменялись — все утверждения этого изменения помечены в `coverage.yaml` как `manual` (нет инфраструктуры для БД-компонентных и браузерных/frontend-тестов, см. `testing.md`), новых автотестов план не требовал.

## Проверки

- `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — 39/39 passed.
- `npx tsc -p tsconfig.json` в `ThinkingHome.Plugins.TelegramChatList.WebUi` — без ошибок.
- `dotnet build ThinkingHome.sln` — выполнен дважды подряд, оба раза `Build succeeded`, 0 Warning(s), 0 Error(s).

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "npx tsc -p tsconfig.json (ThinkingHome.Plugins.TelegramChatList.WebUi) — ок"
  - "dotnet build ThinkingHome.sln (дважды) — Build succeeded, 0 Warning(s), 0 Error(s)"
```
