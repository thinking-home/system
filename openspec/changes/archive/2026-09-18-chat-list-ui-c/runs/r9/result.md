## Верификация: chat-list-ui-c

| Измерение | Результат |
|---|---|
| Полнота | 16/16 задач (`cow status`), 7/7 сценариев спецификации (все manual в coverage.yaml с обоснованной ссылкой на testing.md) |
| Корректность | unit-тесты: 39/39 passed; `npx tsc` — 0 ошибок; `dotnet build ThinkingHome.sln` — успешно (бандл `chats.js` собран) |
| Согласованность | код повторяет паттерн `Cron.WebUi` (D1–D5 из design.md видны в коде); периметр change-set (14 файлов) полностью объяснён артефактами изменения |

### Периметр (14 файлов запечатанного change-set, digest sha256:7b283c10…, paths:14)

По сравнению с предыдущим запечатыванием (run r7, 15 файлов) из change-set исключён `.gitignore` — файл, ранее отмеченный как необъяснённое расширение периметра (не связанное с фичей списка чатов). Сейчас `git diff <base> -- .gitignore` пуст: файл вернулся к состоянию базы, находка из r7 устранена полностью, а не просто принята как риск.

- `ThinkingHome.Plugins.TelegramChatList.WebUi/*.csproj`, `package.json`, `tsconfig.json` — задача 1.1–1.2, по образцу `Cron.WebUi.csproj` — объяснено.
- `ThinkingHome.sln` (M) — задача 1.3, Project-запись и секции конфигурации для нового GUID — объяснено, сверено дифом.
- `TelegramChatListWebUiPlugin.cs` (A) — задача 2.1: `[ConfigureWebUi]` + `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`, идентично структуре `CronWebUiPlugin.cs` — объяснено.
- `Lang/TelegramChatListWebUiPlugin.resx` и `.ru-RU.resx` (A) — задача 2.2: ключи `title, id, login, chatId, firstName, lastName, date, emptyList, errorLoad` присутствуют в обоих файлах, ru-RU переведён — объяснено.
- `frontend/api.ts` (A) — задача 3.1: valibot-схема `chatListSchema` (`id, login, chatId, firstName, lastName, date`, `nullable` для `login/firstName/lastName`), `getChatList` → `/api/telegram-chat-list/web-api/list` — объяснено, соответствует контракту design.md.
- `frontend/lang.ts` (A) — задача 3.2: keyset с ровно тем набором ключей — объяснено.
- `frontend/chats.tsx` (A) — задачи 3.3–3.4, D3/D4/D5: `useEffect`+`AbortController`, `Mantine Table` из 6 колонок, `?? ''` для `null`, ветка `list.length ? Table : Text(emptyList)`, `fail()` → `logger.log`+`toaster.showError(errorLoad)`, отменённый запрос не считается ошибкой — объяснено.
- `README.md` (A) — задача 4.3 — объяснено.
- `package-lock.json` (A) — техническая поддержка (npm install) — объяснено.
- `ThinkingHome.Console/appsettings.json` (M) — задача 4.1: сборка добавлена в `assemblies` рядом с `TelegramChatList.WebApi` — объяснено, сверено дифом.
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (M) — задача 4.2: новый `List.Item`/`Anchor` на `/telegram-chat-list` — объяснено, сверено дифом.

Необъяснённых файлов нет.

### Проверки

- V1 PASS — компиляция TypeScript: `cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json` → без ошибок (exit 0).
- V2 PASS — регрессия unit-тестов C#: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed! - Failed: 0, Passed: 39, Skipped: 0, Total: 39`.
- V3 PASS — сборка решения целиком с клиентским бандлом: `dotnet build ThinkingHome.sln` → `Build succeeded, 0 Warning(s), 0 Error(s)`, `[th-build] ✓ chats → Resources/app/chats.js`.
- V4 PASS — утверждение «Зависимость от HTTP API списка чатов»: `frontend/api.ts` — единственный источник данных `api.get(chatListSchema, {url: '/api/telegram-chat-list/web-api/list', signal})`, обращений к БД или другим эндпоинтам нет.
- V5 PASS — утверждение «Открытие списка чатов»/«Запись с незаполненными полями»: `frontend/chats.tsx` — таблица из 6 полей, `null` через `?? ''`.
- V6 PASS — утверждение «Пустой список и ошибка загрузки»: `list.length ? <Table> : <Text>{t('emptyList')}</Text>`; `fail()` → `toaster.showError(t('errorLoad'))`, `if (signal?.aborted) return`.
- V7 PASS — утверждение «Локализация подписей раздела»: ключи keyset (en, дефолт) совпадают с ключами обоих resx; ru-RU содержит переводы (`title`→«Чаты Telegram», `login`→«Логин»).
- V8 PASS — утверждение «Переход в раздел с корневой страницы»: `git diff` по `Application.tsx` — новый `List.Item`/`Anchor to="/telegram-chat-list"`.
- V9 PASS — задачи tasks.md: `cow status --json` → `tasks: {total: 16, done: 16, remaining: 0}`.
- V10 PASS — целостность запечатанного change-set: `git status --short` до и после всех проверок идентичен; `cow status` подтверждает `digest`/`paths: 14`, совпадающие с пакетом r9.
- V11 PASS — периметр: все 14 файлов change-set объяснены артефактами изменения; ранее найденный необъяснённый `.gitignore` (run r7) из change-set исключён и вернулся к состоянию базы — находка устранена.
- V12 NOT_RUN — согласованность D2 (проверка `/dynamic/web-server/url-validation/errors.txt`): требует запущенного приложения с БД; недоступно в среде верификации (только чтение + команды testing.md).
- V13 NOT_RUN — 5 браузерных сценариев test-plan.md («Открытие списка чатов», «Список чатов пуст», «Ошибка загрузки списка», «Отображение на русском», «Переход с корневой страницы»): в проекте нет тест-раннера для frontend и браузерных тестов (testing.md, «Не автоматизируется»), законно помечены `manual` в coverage.yaml; статическая проверка кода (V4–V8) подтверждает соответствие спецификации.

### Пробелы

- G1 — окружение: локальный запуск приложения с PostgreSQL и браузером; оракул: пункты чеклиста test-plan.md («Открытие списка чатов», «Список чатов пуст», «Ошибка загрузки списка», «Отображение на русском», «Переход с корневой страницы»); риск: низкий — статический разбор кода (V4–V8) показывает точное соответствие спецификации и паттерну Cron.WebUi.
- G2 — окружение: запущенное приложение для `/dynamic/web-server/url-validation/errors.txt`; оракул: отсутствие раздела `/telegram-chat-list` в списке ошибок валидации URL; риск: низкий — маршрут и alias совпадают со схемой, уже принятой для `/cron`.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "компиляция TypeScript нового проекта", result: PASS, evidence: "cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json — exit 0" }
  - { id: V2, purpose: "регрессия unit-тестов C#", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39 passed" }
  - { id: V3, purpose: "сборка решения целиком с клиентским бандлом", result: PASS, evidence: "dotnet build ThinkingHome.sln — Build succeeded, 0 Warning(s), 0 Error(s), chats.js собран" }
  - { id: V4, purpose: "утверждение «Раздел использует HTTP API списка чатов»", result: PASS, evidence: "frontend/api.ts: единственный запрос api.get на /api/telegram-chat-list/web-api/list, обращений к БД нет" }
  - { id: V5, purpose: "утверждение «Открытие списка чатов» / «Запись с незаполненными полями»", result: PASS, evidence: "frontend/chats.tsx: таблица из 6 полей, null через ?? ''" }
  - { id: V6, purpose: "утверждение «Пустой список и ошибка загрузки»", result: PASS, evidence: "frontend/chats.tsx: list.length ? Table : Text(emptyList); fail() → toaster.showError(errorLoad), aborted не считается ошибкой" }
  - { id: V7, purpose: "утверждение «Локализация подписей раздела»", result: PASS, evidence: "lang.ts ключи совпадают с ключами в обоих .resx, ru-RU переведён" }
  - { id: V8, purpose: "утверждение «Переход в раздел с корневой страницы»", result: PASS, evidence: "git diff Application.tsx — новый List.Item/Anchor to=/telegram-chat-list" }
  - { id: V9, purpose: "полнота задач tasks.md", result: PASS, evidence: "cow status --json — tasks: {total:16, done:16, remaining:0}" }
  - { id: V10, purpose: "целостность запечатанного change-set во время верификации", result: PASS, evidence: "git status --short неизменен до/после проверок; digest и paths:14 совпадают с packet.json" }
  - { id: V11, purpose: "объяснимость каждого файла change-set (периметр)", result: PASS, evidence: "все 14 файлов объяснены в tasks.md/design.md; .gitignore исключён из change-set и вернулся к состоянию базы" }
  - { id: V12, purpose: "согласованность D2: маршрут проходит url-validation", result: NOT_RUN, evidence: "нужен запущенный экземпляр приложения с БД" }
  - { id: V13, purpose: "браузерные сценарии из test-plan.md (5 шт.)", result: NOT_RUN, evidence: "testing.md: браузерных тестов и тест-раннера для frontend нет, отмечены manual в coverage.yaml" }
gaps:
  - { id: G1, environment: "локальное приложение + PostgreSQL + браузер", oracle: "чеклист test-plan.md: открытие/пустой список/ошибка загрузки/русская локаль/переход с главной", risk: "низкий: статический разбор кода (V4–V8) подтверждает соответствие спецификации и паттерну Cron.WebUi" }
  - { id: G2, environment: "запущенное приложение", oracle: "/dynamic/web-server/url-validation/errors.txt не содержит записей о /telegram-chat-list", risk: "низкий: схема маршрута идентична уже принятой в Cron.WebUi" }
verified:
  - "npx tsc -p tsconfig.json — 0 ошибок"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "dotnet build ThinkingHome.sln — success"
