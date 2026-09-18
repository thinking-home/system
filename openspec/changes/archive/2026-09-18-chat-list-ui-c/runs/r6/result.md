# Реализация: chat-list-ui-c

## Что изменено

- Новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` (по образцу `Cron.WebUi`): `ThinkingHome.Plugins.TelegramChatList.WebUi.csproj`, `package.json`/`tsconfig.json`, `TelegramChatListWebUiPlugin.cs` (`[ConfigureWebUi]` + `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`), `Lang/TelegramChatListWebUiPlugin.resx` и `.ru-RU.resx`, `frontend/api.ts` (valibot-схема + `getChatList`), `frontend/lang.ts` (keyset `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad`), `frontend/chats.tsx` (загрузка в `useEffect` с `AbortController`, таблица из шести колонок, пустые ячейки для `null`, ветка пустого списка, ошибка через `toaster`/`logger`), `README.md`.
- `ThinkingHome.sln` — зарегистрирован новый проект (GUID `06B1EB53-E544-4D9B-92A6-49197EBE3DE9`) в секциях `Project`, `ProjectConfigurationPlatforms`, `NestedProjects`.
- `ThinkingHome.Console/appsettings.json` — добавлена сборка `ThinkingHome.Plugins.TelegramChatList.WebUi` в `assemblies`.
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — добавлен пункт `List.Item` со ссылкой `/telegram-chat-list` («Telegram chats») в компоненте `Home`.
- `openspec/changes/chat-list-ui-c/tasks.md` — все 16 задач отмечены `[x]`.

## Проверки

- `npx tsc -p tsconfig.json` (каталог `ThinkingHome.Plugins.TelegramChatList.WebUi`) — без ошибок.
- `dotnet build ThinkingHome.sln` — выполнен дважды подряд (см. `architecture.md`, генерируемый код), оба раза `Build succeeded`, `0 Warning(s)`, `0 Error(s)`.
- `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — 39/39 зелёных, регрессий нет.
- `coverage.yaml` для capability `plugins/telegram-chat-list/web-ui` содержит только пометки `manual` (браузерных тестов и тест-раннера для frontend в проекте нет по `testing.md`) — автотестов для прогона нет.
- Сборка проверена: `git add -n` подтверждает, что в staging попадают только исходники нового проекта, генерируемые каталоги (`Resources/app`, `bin`, `obj`, `node_modules`) исключены `.gitignore`.

Защищённых тестов в пакете нет (все сценарии спецификации закрыты вручную согласно `coverage.yaml` и `evidence/tests-review-1.md`), поэтому правок тестовых файлов не потребовалось.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
verified:
  - "npx tsc -p tsconfig.json — без ошибок"
  - "dotnet build ThinkingHome.sln (дважды) — Build succeeded, 0 Warning(s), 0 Error(s)"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
```
