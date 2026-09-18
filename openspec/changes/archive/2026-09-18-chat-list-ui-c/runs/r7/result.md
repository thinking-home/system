## Верификация: chat-list-ui-c

| Измерение | Результат |
|---|---|
| Полнота | 16/16 задач (`cow status`), 7/7 сценариев спецификации (все manual в coverage.yaml с обоснованной ссылкой на testing.md) |
| Корректность | unit-тесты: 39/39 passed; `npx tsc` — 0 ошибок; `dotnet build ThinkingHome.sln` — успешно (бандл `chats.js` собран) |
| Согласованность | код повторяет паттерн `Cron.WebUi` (D1–D5 из design.md видны в коде); один файл (`.gitignore`) не объяснён ни одним артефактом изменения — не блокирует, т.к. подтверждён запечатанным change-set |

### Периметр (15 файлов запечатанного change-set)

- `ThinkingHome.Plugins.TelegramChatList.WebUi/*.csproj`, `package.json`, `tsconfig.json` — задача 1.1–1.2, по образцу `Cron.WebUi.csproj` — объяснено.
- `ThinkingHome.sln` (M) — задача 1.3, добавлена Project-запись и все секции конфигурации/платформ для нового GUID — объяснено, сверено дифом.
- `TelegramChatListWebUiPlugin.cs` (A) — задача 2.1: `[ConfigureWebUi]` + `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`, идентично по структуре `CronWebUiPlugin.cs` — объяснено.
- `Lang/TelegramChatListWebUiPlugin.resx` и `.ru-RU.resx` (A) — задача 2.2: ключи `title, id, login, chatId, firstName, lastName, date, emptyList, errorLoad` присутствуют в обоих файлах, ru-RU переведён (например `title` → «Чаты Telegram», `login` → «Логин») — объяснено.
- `frontend/api.ts` (A) — задача 3.1: valibot-схема `chatListSchema` с полями `id, login, chatId, firstName, lastName, date` (`nullable` для `login/firstName/lastName`), `getChatList` бьёт в `/api/telegram-chat-list/web-api/list` — объяснено, соответствует контракту из design.md.
- `frontend/lang.ts` (A) — задача 3.2: keyset с ровно теми ключами, что в задаче — объяснено.
- `frontend/chats.tsx` (A) — задачи 3.3–3.4, D3/D4/D5: `useEffect` + `AbortController`, `Mantine Table` с 6 колонками, `??  ''` для `null`-полей, ветка `list.length ? Table : Text(emptyList)`, `fail()` → `logger.log` + `toaster.showError(errorLoad)`, отменённый запрос не считается ошибкой (`signal?.aborted`) — объяснено, реализация соответствует D3–D5 дословно.
- `README.md` (A) — задача 4.3 — объяснено.
- `package-lock.json` (A) — техническая поддержка (npm install для нового проекта) — объяснено.
- `ThinkingHome.Console/appsettings.json` (M) — задача 4.1: сборка `TelegramChatList.WebUi` добавлена в `assemblies` рядом с `TelegramChatList.WebApi` — объяснено, сверено дифом.
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (M) — задача 4.2: новый `List.Item`/`Anchor` на `/telegram-chat-list` с текстом «Telegram chats» — объяснено, сверено дифом.
- `.gitignore` (M) — **не упомянут ни в tasks.md, ни в design.md, ни в evidence/research.md, ни в log.md**. Диф добавляет паттерны `**/.cow/**/.lock`, `**/.stop`, `**/change.yaml.*.tmp`, `**/runs/run.log`, `**/runs/r*/packet.json` — это инфраструктура самого инструмента cow, не связанная с разделом списка чатов. Файл входит в запечатанный change-set (`cow status --json`: `paths: 15`, дайджест совпадает с пакетом), то есть попадание санкционировано процессом запечатывания, но по содержанию это расширение объёма задачи без объяснения в артефактах изменения. Не блокирует (реализация не создаёт риска регрессии — правило `.gitignore` не влияет на код фичи), но это несоответствие корректному документированию объёма.

### Проверки

- V1 PASS — компиляция TypeScript нового проекта: `cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json` → завершилось без ошибок (exit 0).
- V2 PASS — регрессия unit-тестов C#: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed! - Failed: 0, Passed: 39, Skipped: 0, Total: 39`.
- V3 PASS — сборка решения целиком, включая клиентский бандл: `dotnet build ThinkingHome.sln` → `Build succeeded, 0 Warning(s), 0 Error(s)`, лог показывает `[th-build] ✓ chats → Resources/app/chats.js` и `ThinkingHome.Plugins.TelegramChatList.WebUi -> …dll`.
- V4 PASS — утверждение «Зависимость от HTTP API списка чатов» (не обращаться к БД, использовать `/api/telegram-chat-list/web-api/list»): чтение `frontend/api.ts` → единственный источник данных — `api.get(chatListSchema, {url: '/api/telegram-chat-list/web-api/list', signal})`; прямых обращений к БД или другим эндпоинтам в проекте нет (`grep -r` по каталогу подтверждает единственный URL).
- V5 PASS — утверждение «Раздел списка чатов» / «Запись с незаполненными полями»: чтение `frontend/chats.tsx` → таблица со всеми 6 полями (`id, login, chatId, firstName, lastName, date`), для `login/firstName/lastName` используется `?? ''` при `null`.
- V6 PASS — утверждение «Пустой список и ошибка загрузки»: `list.length ? <Table> : <Text>{t('emptyList')}</Text>`; `fail()` вызывает `toaster.showError(t('errorLoad'))` и не считает отменённый запрос ошибкой (`if (signal?.aborted) return`).
- V7 PASS — утверждение «Локализация подписей раздела»: ключи keyset (`en`, дефолт) 1:1 совпадают с ключами в обоих resx-файлах; `ru-RU.resx` содержит переводы (не копии английского текста для проверенных ключей `title`, `login`).
- V8 PASS — утверждение «Переход в раздел с корневой страницы»: `git diff` по `Application.tsx` показывает новый `List.Item`/`Anchor to="/telegram-chat-list"` в компоненте `Home`.
- V9 PASS — задачи `tasks.md`: `cow status --change chat-list-ui-c --json` → `tasks: {total: 16, done: 16, remaining: 0}`.
- V10 PASS — целостность запечатанного change-set: `git status --short` до и после всех проверок идентичен (только файлы из changeset изменены/добавлены, рабочая копия не тронута верификатором); `cow status` подтверждает `digest` пакета совпадает с сохранённым в change (paths: 15).
- V11 PARTIAL — периметр: 14 из 15 файлов имеют прямое объяснение в tasks.md/design.md; файл `.gitignore` входит в подписанный changeset, но не объяснён ни в одном артефакте изменения (см. раздел «Периметр» выше).
- V12 NOT_RUN — согласованность решения D2 (проверка `/dynamic/web-server/url-validation/errors.txt`): требует запущенного приложения с БД; не выполнялось верификатором (только чтение + команды из testing.md, окружения e2e нет).
- V13 NOT_RUN — сценарии, требующие браузера («Открытие списка чатов», «Список чатов пуст», «Ошибка загрузки списка», «Отображение раздела на русском языке», «Переход на список чатов с корневой страницы»): в проекте нет тест-раннера для frontend и браузерных тестов (testing.md, «Не автоматизируется»), они законно помечены `manual` в `coverage.yaml`; статически код соответствует ожидаемому поведению (см. V4–V8), но фактическое исполнение в браузере не проверялось.

### Пробелы

- G1 — окружение: локальный запуск приложения с PostgreSQL и открытым браузером; оракул: пункты чеклиста `test-plan.md` («Открытие списка чатов», «Список чатов пуст», «Ошибка загрузки списка», «Отображение на русском», «Переход с корневой страницы»); риск: низкий — статическая проверка кода (V4–V8) показывает, что логика реализована точно по спецификации и design.md, отклонений от паттерна `Cron.WebUi` не найдено.
- G2 — окружение: запущенное приложение для `/dynamic/web-server/url-validation/errors.txt`; оракул: отсутствие раздела `/telegram-chat-list` в списке ошибок валидации URL; риск: низкий — маршрут и alias совпадают с уже принятой схемой (`Cron.WebUi` использует тот же паттерн `/{plugin}`).

### Примечание о непокрытом изменении

- `.gitignore` — изменение входит в запечатанный change-set, но не задокументировано ни в одном артефакте (proposal/design/tasks/evidence). Это не блокирует верификацию (изменение безопасно и не влияет на код фичи), но ревьюеру стоит решить, является ли это расширением объёма, требующим объяснения в проекте, или техническим следом инструментария cow.

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
  - { id: V10, purpose: "целостность запечатанного change-set во время верификации", result: PASS, evidence: "git status --short неизменен до/после проверок; digest совпадает с packet.json" }
  - { id: V11, purpose: "объяснимость каждого файла change-set (периметр)", result: PARTIAL, evidence: "14/15 файлов объяснены в tasks.md/design.md; .gitignore не упомянут ни в одном артефакте изменения" }
  - { id: V12, purpose: "согласованность D2: маршрут проходит url-validation", result: NOT_RUN, evidence: "нужен запущенный экземпляр приложения с БД" }
  - { id: V13, purpose: "браузерные сценарии из test-plan.md (5 шт.)", result: NOT_RUN, evidence: "testing.md: браузерных тестов и тест-раннера для frontend нет, отмечены manual в coverage.yaml" }
gaps:
  - { id: G1, environment: "локальное приложение + PostgreSQL + браузер", oracle: "чеклист test-plan.md: открытие/пустой список/ошибка загрузки/русская локаль/переход с главной", risk: "низкий: статический разбор кода (V4–V8) подтверждает соответствие спецификации и паттерну Cron.WebUi" }
  - { id: G2, environment: "запущенное приложение", oracle: "/dynamic/web-server/url-validation/errors.txt не содержит записей о /telegram-chat-list", risk: "низкий: схема маршрута идентична уже принятой в Cron.WebUi" }
verified:
  - "npx tsc -p tsconfig.json — 0 ошибок"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "dotnet build ThinkingHome.sln — success"
