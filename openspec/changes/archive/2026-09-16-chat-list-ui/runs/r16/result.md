# Реализация: интерфейс списка чатов

## Что сделано

- **Порядок ответа HTTP API (задачи 1.1–1.2).** В `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` выборка чатов дополнена `OrderByDescending(x => x.Date)` до проекции (сортирует СУБД, D3); фиксированный порядок описан в `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md` (пример ответа переставлен так, чтобы самая новая запись была первой).
- **Новый раздел `ThinkingHome.Plugins.TelegramChatList.WebUi` (задачи 2.1–4.9).** Проект по образцу `Cron.WebUi`: `.csproj` (таргеты `NpmInstall`, `BuildClientDevelopment`, `BuildClientProduction`, `EmbeddedResource Resources\**\*`, ссылки только на `Core.Plugins`, `WebServer`, `WebUi`), `package.json` с `thPlugin.entries = { "chats": "frontend/chats.tsx" }` и `package-lock.json`, `tsconfig.json`, класс `TelegramChatListWebUiPlugin` с `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`, `Lang/TelegramChatListWebUiPlugin.resx` и `…ru-RU.resx` (ключи `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad`), клиент `frontend/{api.ts,lang.ts,chats.tsx}`: схема valibot, загрузка в `useEffect` с `AbortController`, `Table` Mantine со всеми полями в порядке ответа API, прочерк для `null`, дата по `lang` из `useAppContext()`, пустой список — `<Text c="dimmed">{t('emptyList')}</Text>`, ошибка — запись в `useLogger` и `toaster.showError(t('errorLoad'))`.
- **Ссылка и подключение к хосту (задачи 5.1, 6.1–6.4).** Пункт `Telegram chats → /telegram-chat-list` в компоненте `Home` (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`); проект добавлен в `ThinkingHome.sln` (папка решения `Plugins`), в `ProjectReference` `ThinkingHome.Console/ThinkingHome.Console.csproj` и в `assemblies` файла `ThinkingHome.Console/appsettings.json`; написан `ThinkingHome.Plugins.TelegramChatList.WebUi/README.md`, добавлена строка в список плагинов корневого `README.md`.

Все 26 задач `tasks.md` отмечены `- [x]`, проверки раздела «7. Проверки» зелёные (см. `verified`).

## Изменённые файлы

Новые (`ThinkingHome.Plugins.TelegramChatList.WebUi/`):

- `ThinkingHome.Plugins.TelegramChatList.WebUi.csproj`, `package.json`, `package-lock.json`, `tsconfig.json`
- `TelegramChatListWebUiPlugin.cs`
- `Lang/TelegramChatListWebUiPlugin.resx`, `Lang/TelegramChatListWebUiPlugin.ru-RU.resx`
- `frontend/api.ts`, `frontend/lang.ts`, `frontend/chats.tsx`
- `README.md`

Изменённые:

- `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`, `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md`
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`
- `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json`
- `README.md` (корневой)
- `openspec/changes/chat-list-ui/tasks.md` — только отметки `- [x]` (26 из 26)

Сборочные артефакты (`Resources/app/**`, `node_modules/`, `bin`, `obj`) не коммитятся — они под `.gitignore`.

## Заметки

- Форматирование даты: `new Intl.DateTimeFormat(lang || undefined, …)` — у сервера без настройки `culture` (`HomeConfiguration.GetCulture()` возвращает инвариантную культуру) `lang` приходит пустой строкой, на которой `Intl` бросает `RangeError`; в этом случае берётся язык браузера. При заданном `culture` (в `appsettings.json` — `ru-RU`) поведение ровно по D4.
- Автотестов по дельтам нет (`coverage.yaml`: все 15 утверждений помечены `manual`), поэтому новых тестов не добавлялось. Защищённые `coverage.yaml` и `test-plan.md` в прогоне не изменялись: после коммита `5165afd` они отслеживаются git и `git diff HEAD` по ним пуст.
- Ранее прогон был отклонён с `PROTECTED_CHANGED` из-за того, что каталог изменения был untracked (`protectedViolations` в resolver-cow@0.5.0 прогоняет через глобы защиты вывод `git status --porcelain --untracked-files=all` вместе со строками `??`). После коммита артефактов владельцем причина устранена, правок в реализации не потребовалось.
- Ручной сценарий из «Стратегии проверки» (запуск хоста с PostgreSQL, проверка порядка ответа `curl`, раздела и пустого состояния в браузере, сравнение `/dynamic/web-server/url-validation/errors.txt`) выполняет человек — в задачах он не планировался.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
verified:
  - "tasks.md — 26/26 задач отмечены `- [x]`, незакрытых нет"
  - "dotnet build ThinkingHome.sln — succeeded, 0 warnings, 0 errors (прогнан дважды подряд; бандл chats.js и сателлит ru-RU попали в DLL нового плагина)"
  - "npx tsc -p tsconfig.json в ThinkingHome.Plugins.TelegramChatList.WebUi — ок (0 ошибок)"
  - "npx tsc -p tsconfig.json в ThinkingHome.Plugins.WebUi — ок (0 ошибок, после правки Application.tsx)"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39 passed"
  - "npm run build:development в ThinkingHome.Plugins.TelegramChatList.WebUi — chats.js + .gz/.br, react/@mantine/@thinking-home остались внешними импортами"
  - "coverage.yaml: автотестов нет, все 15 утверждений manual — прогонять нечего"
  - "защищённые файлы не изменялись: git diff HEAD по coverage.yaml и test-plan.md пуст (после коммита 5165afd оба отслеживаются)"
```
