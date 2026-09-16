# Реализация: интерфейс списка чатов

## Что сделано

- **Порядок ответа HTTP API (задачи 1.1–1.2).** В `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` выборка чатов дополнена `OrderByDescending(x => x.Date)` до проекции (сортирует СУБД, D3); фиксированный порядок описан в `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md` (пример ответа переставлен так, чтобы самая новая запись была первой).
- **Новый раздел `ThinkingHome.Plugins.TelegramChatList.WebUi` (задачи 2.1–4.9).** Проект по образцу `Cron.WebUi`: `.csproj` (таргеты `NpmInstall`, `BuildClientDevelopment`, `BuildClientProduction`, `EmbeddedResource Resources\**\*`, ссылки только на `Core.Plugins`, `WebServer`, `WebUi`), `package.json` с `thPlugin.entries = { "chats": "frontend/chats.tsx" }` и `package-lock.json`, `tsconfig.json`, класс `TelegramChatListWebUiPlugin` с `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`, `Lang/TelegramChatListWebUiPlugin.resx` и `…ru-RU.resx` (ключи `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad`), клиент `frontend/{api.ts,lang.ts,chats.tsx}`: схема valibot, загрузка в `useEffect` с `AbortController`, `Table` Mantine со всеми полями в порядке ответа API, прочерк для `null`, дата по `lang` из `useAppContext()`, пустой список — `<Text c="dimmed">{t('emptyList')}</Text>`, ошибка — запись в `useLogger` и `toaster.showError(t('errorLoad'))`.
- **Ссылка и подключение к хосту (задачи 5.1, 6.1–6.4).** Пункт `Telegram chats → /telegram-chat-list` в компоненте `Home` (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`); проект добавлен в `ThinkingHome.sln` (папка решения `Plugins`), в `ProjectReference` `ThinkingHome.Console/ThinkingHome.Console.csproj` и в `assemblies` файла `ThinkingHome.Console/appsettings.json`; написан `ThinkingHome.Plugins.TelegramChatList.WebUi/README.md`, добавлена строка в список плагинов корневого `README.md`.

Все 26 задач `tasks.md` отмечены `- [x]`, проверки раздела «7. Проверки» зелёные (см. `verified`).

## Блокер: PROTECTED_CHANGED — защищённые файлы я не менял

Правок в `coverage.yaml` и `test-plan.md` в этом прогоне не было, откатывать нечего. Диагностика CLI — ложное срабатывание из-за того, что каталог изменения ещё не в git:

- Проверка в CLI: `dist/core/protect.js` → `changedFiles()` выполняет `git status --porcelain --untracked-files=all` и отдаёт **все** строки, включая untracked (`??`); `protectedViolations()` фильтрует их по глобам из `change.yaml`. То есть любой untracked файл, попадающий под защиту, считается «изменённым».
- Состояние репозитория: `openspec/changes/chat-list-ui/` целиком untracked (базовая ревизия `f471e65` его не содержит), поэтому `git status --porcelain -uall` выдаёт `?? openspec/changes/chat-list-ui/coverage.yaml` и `?? openspec/changes/chat-list-ui/test-plan.md` — это и есть «нарушение». Тот же вывод был до начала моего прогона (его зафиксировал tester в `runs/r14/result.md`).
- Доказательство, что файлы не трогались: `coverage.yaml` — mtime 2026-09-16 17:06Z (прогон r10), `test-plan.md` — mtime 17:20Z (прогон r14), гейт tests утверждён 17:24:23Z; пакет r16 создан 17:24Z, все мои записи на диск — с 17:26Z (новый проект, `Application.tsx`, `tasks.md` 17:30Z). Содержимое обоих файлов совпадает с описанием сдачи r14: 15 утверждений `manual` (3 по `http-api`, 12 по `web-ui`), test-plan — 15 ручных проверок. Текущие хэши: `coverage.yaml` sha256 `2912526bbd7f906c798b6ee02f060375e53f30291af162ec8f494f5aa6137fcd`, `test-plan.md` sha256 `52ad4d282d607b3d68fef868e8fe4d48e0af9db4741f77a406e11195c426c384`.

Что снимет блокер (вне моих полномочий — коммитить агент не может, флага обхода у `cow report` нет):

1. Владелец коммитит артефакты изменения (`openspec/changes/chat-list-ui/**`, при необходимости вместе с продуктовыми правками) — после этого защищённые файлы становятся отслеживаемыми и немодифицированными, `git status` их не показывает, и `cow report --role implementer --file openspec/changes/chat-list-ui/runs/r16/result.md` проходит проверку без изменений в реализации.
2. Либо проверка `protectedViolations` в CLI перестаёт учитывать untracked-файлы (сравнение по содержимому/хэшу со снимком на гейте tests) — это правка инструмента, не репозитория.

Претензий к покрытию и ручным проверкам у меня нет: `coverage.yaml` корректно помечает все 15 утверждений как `manual` (автотестов по дельтам в проекте быть не может — `testing.md`), блокер категории «тесты» не требуется.

## Отступления и заметки

- Форматирование даты: `new Intl.DateTimeFormat(lang || undefined, …)` — у сервера без настройки `culture` (`HomeConfiguration.GetCulture()` возвращает инвариантную культуру) `lang` приходит пустой строкой, на которой `Intl` бросает `RangeError`; в этом случае берётся язык браузера. При заданном `culture` (в `appsettings.json` — `ru-RU`) поведение ровно по D4.
- Ручной сценарий из «Стратегии проверки» (запуск хоста с PostgreSQL, проверка порядка ответа `curl`, раздела и пустого состояния в браузере, сравнение `/dynamic/web-server/url-validation/errors.txt`) выполняет человек — в задачах он не планировался.
- Из артефактов менялся только `tasks.md` (отметки `- [x]`, 26 из 26).

```yaml
# cow-result
status: заблокировано
blocker: { category: внешний, artifact: "", message: "cow report отклоняет прогон с PROTECTED_CHANGED по openspec/changes/chat-list-ui/coverage.yaml и test-plan.md, хотя эти файлы в прогоне не изменялись (mtime 17:06Z и 17:20Z — до старта r16 в 17:24Z). Причина в проверке CLI: changedFiles() берёт весь вывод git status --porcelain --untracked-files=all, а каталог openspec/changes/chat-list-ui/ ещё не закоммичен, поэтому защищённые файлы всегда числятся изменёнными. Нужен внешний шаг: владелец коммитит артефакты изменения (агент не коммитит по conventions.md) либо CLI перестаёт считать untracked-файлы изменёнными. Реализация при этом завершена и зелёная." }
verified:
  - "dotnet build ThinkingHome.sln — succeeded, 0 warnings, 0 errors (прогнан дважды подряд; бандл chats.js и сателлит ru-RU попали в DLL нового плагина)"
  - "npx tsc -p tsconfig.json в ThinkingHome.Plugins.TelegramChatList.WebUi — ок (0 ошибок)"
  - "npx tsc -p tsconfig.json в ThinkingHome.Plugins.WebUi — ок (0 ошибок, после правки Application.tsx)"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39 passed"
  - "npm run build:development в ThinkingHome.Plugins.TelegramChatList.WebUi — chats.js + .gz/.br, react/@mantine/@thinking-home остались внешними импортами"
  - "coverage.yaml: автотестов нет, все 15 утверждений manual — прогонять нечего"
  - "защищённые файлы не изменялись: mtime coverage.yaml 17:06Z, test-plan.md 17:20Z (гейт tests — 17:24:23Z, пакет r16 — 17:24Z, первая моя запись — 17:26Z)"
```
