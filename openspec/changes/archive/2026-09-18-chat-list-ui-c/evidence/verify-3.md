## Верификация: chat-list-ui-c

| Измерение | Результат |
|---|---|
| Полнота | 16/16 задач (`cow status`), 7/7 сценариев спецификации (все manual в coverage.yaml с обоснованной ссылкой на testing.md) |
| Корректность | unit-тесты: 39/39 passed; `npx tsc` — 0 ошибок; `dotnet build ThinkingHome.sln` — успешно (бандл `chats.js` собран) |
| Согласованность | код повторяет паттерн `Cron.WebUi` (D1–D5 из design.md видны в коде); 14/15 файлов change-set объяснены артефактами, `.gitignore` — повторяющаяся необъяснённая находка (см. ниже) |

### Периметр (15 файлов запечатанного change-set, digest sha256:c1f0f62…, paths:15)

Change-set совпадает по составу и содержимому с запечатанным в run r7 (тот же digest `sha256:c1f0f62…`). Между r7 и этой верификацией был промежуточный цикл: run r9 верифицировал более узкий change-set из 14 файлов (без `.gitignore`, digest `sha256:7b283c10…`), run r10 (review) принял его как «готово». После r10 `changeset.json` был повторно запечатан (`sealed_at: 2026-09-18T06:13:10.946Z`, позже финиша r10 в `2026-09-18T06:11:49.710Z`) и снова включает `.gitignore` — то есть находка, устранённая к r9, **вернулась**.

- 14 файлов (проект `TelegramChatList.WebUi`, `TelegramChatListWebUiPlugin.cs`, `frontend/*`, `Lang/*.resx`, `README.md`, `package*.json`, `tsconfig.json`, `ThinkingHome.sln`, `ThinkingHome.Console/appsettings.json`, `Application.tsx`) — объяснены задачами 1.1–4.3 из `tasks.md` и решениями D1–D5 из `design.md`, идентичны проверенным в run r7/r9 (реализация не менялась между запусками).
- `.gitignore` (M) — диф идентичен r7 (`git diff <base> -- .gitignore`): добавляет паттерны `**/.cow/**/.lock`, `**/.stop`, `**/change.yaml.*.tmp`, `**/runs/run.log`, `**/runs/r*/packet.json`. Это служебная инфраструктура инструмента `cow` (игнор-правила для его собственных временных файлов запуска), не связанная с разделом списка чатов Telegram. Не упомянут ни в `proposal.md`, ни в `design.md`, ни в `tasks.md`, ни в `evidence/research.md`. Изменение безопасно (не затрагивает код фичи, поведение или сборку приложения), но остаётся необъяснённым расширением периметра — тот же вывод, что в r7 (там принят ревьюером как `manual_gap_accepted`/неблокирующая находка), и это уже второй раз, когда оно появляется в запечатанном change-set после явного устранения в промежуточном цикле (r9). Рекомендую ревьюеру и координатору обратить внимание на нестабильность периметра между запечатываниями — сам факт колебания (появляется/пропадает) говорит о том, что это побочный эффект процесса `cow` (пере-запечатывание после review), а не намеренное действие реализатора.

### Проверки

- V1 PASS — компиляция TypeScript: `cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json` → без ошибок (exit 0).
- V2 PASS — регрессия unit-тестов C#: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed! - Failed: 0, Passed: 39, Skipped: 0, Total: 39`.
- V3 PASS — сборка решения целиком с клиентским бандлом: `dotnet build ThinkingHome.sln` → `Build succeeded, 0 Warning(s), 0 Error(s)`.
- V4 PASS — утверждение «Зависимость от HTTP API списка чатов»: `frontend/api.ts` — единственный источник данных `api.get(chatListSchema, {url: '/api/telegram-chat-list/web-api/list', signal})`.
- V5 PASS — утверждение «Открытие списка чатов»/«Запись с незаполненными полями»: `frontend/chats.tsx` — таблица из 6 полей, `null` через `?? ''`.
- V6 PASS — утверждение «Пустой список и ошибка загрузки»: `list.length ? <Table> : <Text>{t('emptyList')}</Text>`; `fail()` → `toaster.showError(t('errorLoad'))`, отменённый запрос не считается ошибкой.
- V7 PASS — утверждение «Локализация подписей раздела»: ключи keyset (en) совпадают с ключами обоих `.resx`, ru-RU переведён.
- V8 PASS — утверждение «Переход в раздел с корневой страницы»: `git diff` по `Application.tsx` — новый `List.Item`/`Anchor to="/telegram-chat-list"`.
- V9 PASS — задачи tasks.md: `cow status --json` → `tasks: {total: 16, done: 16, remaining: 0}`.
- V10 PASS — целостность запечатанного change-set во время этой верификации: `git status --short` до и после проверок идентичен; `cow status` подтверждает `digest`/`paths: 15`, совпадающие с пакетом r11.
- V11 PARTIAL — периметр: 14/15 файлов объяснены артефактами; `.gitignore` необъяснён и повторно появился после устранения в r9 (см. раздел «Периметр»).
- V12 NOT_RUN — согласованность D2 (`/dynamic/web-server/url-validation/errors.txt`): требует запущенного приложения с БД, недоступно в среде верификации.
- V13 NOT_RUN — 5 браузерных сценариев test-plan.md: нет тест-раннера для frontend и браузерных тестов (testing.md), законно помечены `manual` в coverage.yaml; статическая проверка кода (V4–V8) подтверждает соответствие спецификации.

### Пробелы

- G1 — окружение: локальное приложение + PostgreSQL + браузер; оракул: чеклист test-plan.md (открытие/пустой список/ошибка загрузки/русская локаль/переход с главной); риск: низкий — статический разбор кода (V4–V8) подтверждает соответствие спецификации и паттерну Cron.WebUi.
- G2 — окружение: запущенное приложение; оракул: отсутствие `/telegram-chat-list` в `/dynamic/web-server/url-validation/errors.txt`; риск: низкий — маршрут идентичен уже принятой схеме `/cron`.
- G3 — окружение: доступ к внутренней логике сборки/запечатывания `cow`; оракул: `.gitignore` не меняется change-set'ом фичи между последовательными запечатываниями одного и того же изменения; риск: низкий по содержанию правил (безопасны), но процессный — колебание периметра усложняет аудит того, что реально доставляется.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "компиляция TypeScript нового проекта", result: PASS, evidence: "cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json — exit 0" }
  - { id: V2, purpose: "регрессия unit-тестов C#", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39 passed" }
  - { id: V3, purpose: "сборка решения целиком с клиентским бандлом", result: PASS, evidence: "dotnet build ThinkingHome.sln — Build succeeded, 0 Warning(s), 0 Error(s)" }
  - { id: V4, purpose: "утверждение «Раздел использует HTTP API списка чатов»", result: PASS, evidence: "frontend/api.ts: единственный запрос api.get на /api/telegram-chat-list/web-api/list, обращений к БД нет" }
  - { id: V5, purpose: "утверждение «Открытие списка чатов» / «Запись с незаполненными полями»", result: PASS, evidence: "frontend/chats.tsx: таблица из 6 полей, null через ?? ''" }
  - { id: V6, purpose: "утверждение «Пустой список и ошибка загрузки»", result: PASS, evidence: "frontend/chats.tsx: list.length ? Table : Text(emptyList); fail() → toaster.showError(errorLoad), aborted не считается ошибкой" }
  - { id: V7, purpose: "утверждение «Локализация подписей раздела»", result: PASS, evidence: "lang.ts ключи совпадают с ключами в обоих .resx, ru-RU переведён" }
  - { id: V8, purpose: "утверждение «Переход в раздел с корневой страницы»", result: PASS, evidence: "git diff Application.tsx — новый List.Item/Anchor to=/telegram-chat-list" }
  - { id: V9, purpose: "полнота задач tasks.md", result: PASS, evidence: "cow status --json — tasks: {total:16, done:16, remaining:0}" }
  - { id: V10, purpose: "целостность запечатанного change-set во время верификации", result: PASS, evidence: "git status --short неизменен до/после проверок; digest sha256:c1f0f62… и paths:15 совпадают с packet.json" }
  - { id: V11, purpose: "объяснимость каждого файла change-set (периметр)", result: PARTIAL, evidence: "14/15 файлов объяснены; .gitignore не упомянут ни в одном артефакте изменения и повторно появился после устранения в run r9 (тот же диф, что и в r7)" }
  - { id: V12, purpose: "согласованность D2: маршрут проходит url-validation", result: NOT_RUN, evidence: "нужен запущенный экземпляр приложения с БД" }
  - { id: V13, purpose: "браузерные сценарии из test-plan.md (5 шт.)", result: NOT_RUN, evidence: "testing.md: браузерных тестов и тест-раннера для frontend нет, отмечены manual в coverage.yaml" }
gaps:
  - { id: G1, environment: "локальное приложение + PostgreSQL + браузер", oracle: "чеклист test-plan.md: открытие/пустой список/ошибка загрузки/русская локаль/переход с главной", risk: "низкий: статический разбор кода (V4–V8) подтверждает соответствие спецификации и паттерну Cron.WebUi" }
  - { id: G2, environment: "запущенное приложение", oracle: "/dynamic/web-server/url-validation/errors.txt не содержит записей о /telegram-chat-list", risk: "низкий: схема маршрута идентична уже принятой в Cron.WebUi" }
  - { id: G3, environment: "доступ к внутренней логике запечатывания change-set в cow", oracle: ".gitignore не входит в change-set фичи при повторном запечатывании после review", risk: "низкий по содержанию (правила безопасны и не влияют на код), но затрудняет аудит стабильности периметра между запусками" }
verified:
  - "npx tsc -p tsconfig.json — 0 ошибок"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "dotnet build ThinkingHome.sln — success"
