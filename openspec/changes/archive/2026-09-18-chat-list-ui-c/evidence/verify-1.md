## Верификация: chat-list-ui-c

| Измерение | Результат |
|---|---|
| Полнота | 19/19 задач (`cow status`), 8/8 утверждений дельт покрыты кодом |
| Корректность | тесты: 39/39 passed (`dotnet test`); проверки: `tsc` — 0 ошибок, `dotnet build` — успех, ручной прогон приложения — успех |
| Согласованность | образец `Cron.WebUi` соблюдён; все места подключения (`sln`, `.csproj`, `appsettings.json`, `Application.tsx`, `README.md`) на месте; `.gitignore` — housekeeping правил `cow`, не влияет на поведение |

### Периметр (git diff относительно base 9d4c492)

- `.gitignore` — добавлены паттерны `**/.stop`, `**/change.yaml.*.tmp`, `**/runs/run.log`, `**/runs/r*/packet.json`. Ни в одном артефакте изменения (proposal/design/tasks/evidence) это не упомянуто явно, но по факту это необходимая поддержка самого workflow `cow`: каталог `openspec/changes/chat-list-ui-c/runs/**`, который это изменение и создаёт, содержит `packet.json`/`.stop` для каждого запуска, и без этих правил такие служебные файлы попали бы в git. Не влияет на код продукта, риска для функциональности нет. Отмечаю как PASS с оговоркой (см. V1).
- `README.md` — добавлена строка про новый плагин, соответствует задаче 5.5.
- `ThinkingHome.Console/ThinkingHome.Console.csproj`, `appsettings.json`, `ThinkingHome.sln` — регистрация нового модуля, соответствует задачам 5.1–5.3, месту подключения из `design.md`.
- `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` — добавлен `OrderByDescending(x => x.Date)` до `Select`/`ToArray`, реализует D2 и требование «Список сохранённых чатов» (сценарий «Порядок записей в ответе»).
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — добавлена ссылка `/telegram-chat-list` → «Telegram chats» в списке `Home`, реализует требование «Ссылка на раздел списка чатов на корневой странице» (D1).
- Новый каталог `ThinkingHome.Plugins.TelegramChatList.WebUi/` (все файлы `A`) — каркас раздела по образцу `Cron.WebUi`: `.csproj` (техническая задача 2.1, отличие — только `Description`), `package.json`/`tsconfig.json` (2.2), `TelegramChatListWebUiPlugin.cs` с `RegisterPage("/telegram-chat-list", Bundle("chats.js"))` (2.3, D1), `frontend/api.ts` — valibot-схема и запрос `GET /api/telegram-chat-list/web-api/list` (3.1), `frontend/lang.ts` — `Keyset('en', …)` со всеми ключами (3.2), `frontend/chats.tsx` — `useEffect`+`AbortController`, таблица без действий изменения, прочерк для `null`, сообщение при пустом списке, `toaster.showError`+`logger` при ошибке, `toLocaleString()` для даты (3.3–3.6, D3, D4), `Lang/*.resx` (4.1), `README.md` проекта (5.5).

Необъяснимых файлов, кроме `.gitignore` (разобран выше и принят как поддержка), не найдено.

### Проверки

- V1 PASS — периметр изменения: `git diff 9d4c492...HEAD --stat` → все 18 файлов из `changeset.files` объяснены реализацией утверждений/дизайна/техническими задачами; `.gitignore` — необходимая поддержка запуска `cow` для этого изменения (каталог `runs/**` самого изменения), не влияет на продукт.
- V2 PASS — задачи `tasks.md` завершены: `cow status --change chat-list-ui-c --json` → `"tasks": {"total": 19, "done": 19, "remaining": 0}`.
- V3 PASS — сортировка API реализована: чтение `TelegramChatListWebApiPlugin.cs` → `db.Set<Chat>().OrderByDescending(x => x.Date).Select(...)` до `ToArray()`; ближайший неверный вариант (сортировка после материализации в памяти или на клиенте) отсутствует — сортировка именно в LINQ-запросе к БД, как того требует D2.
- V4 PASS — регрессия unit-тестов: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed! Failed: 0, Passed: 39, Skipped: 0, Total: 39`.
- V5 PASS — типы клиентской части: `cd ThinkingHome.Plugins.TelegramChatList.WebUi && npx tsc -p tsconfig.json` → завершилось без вывода и с кодом 0 (ошибок нет).
- V6 PASS — сборка решения: `dotnet build ThinkingHome.sln` → `Build succeeded. 0 Warning(s) 0 Error(s)`; th-build собрал `chats.js` без ошибок.
- V7 PASS — запуск приложения и проверка маршрута/API: `dotnet bin/Debug/net10.0/ThinkingHome.Console.dll` с портом 8090 и локальным PostgreSQL (podman) → все плагины стартовали, включая `TelegramChatList.WebUi`; `curl http://localhost:8090/api/telegram-chat-list/web-api/list` → `200`, тело `[{"id":"...","login":null,"chatId":-4579178700,"firstName":null,"lastName":null,"date":"2025-07-20T12:54:14"}]` — подтверждает требование «Отсутствующие значения полей» (`login`/`firstName`/`lastName` = `null`) на реальных данных; `curl http://localhost:8090/api/webui/meta` → `200`, содержит `"/telegram-chat-list": {"js": "...", "langId": "..."}` — раздел зарегистрирован; бандл `chats.js` содержит строки `telegram-chat-list/web-api/list` и `Telegram chats`; `main.js` (бандл оболочки) содержит `telegram-chat-list` и `Telegram chats` — ссылка на корневой странице подтверждена в собранном коде. Приложение остановлено (`pkill`), рабочая копия не изменена (`git status --short` совпадает с исходным).
- V8 PASS — согласованность с образцом: `diff ThinkingHome.Plugins.Cron.WebUi/*.csproj ThinkingHome.Plugins.TelegramChatList.WebUi/*.csproj` → единственное отличие — `Description`; структура `frontend/{api,chats,lang}` и `Lang/*.resx` повторяет образец, как зафиксировано в `design.md` («Единообразие»).
- V9 PASS — локализация: `Lang/TelegramChatListWebUiPlugin.resx` (en) и `.ru-RU.resx` содержат все ключи из `lang.ts` (`title`, `chatId`, `login`, `firstName`, `lastName`, `date`, `id`, `emptyList`, `errorLoad`) с переводами.
- V10 PASS — wiring: `packet.wiring.gaps` пуст, все `registrationFiles` (`ThinkingHome.Console.csproj`, `appsettings.json`, `ThinkingHome.sln`) содержат запись о новом модуле (см. диф выше); исключения (`ThinkingHome.Tests`, `testing.md`, `architecture.md`) не изменены и не требовали изменений.

### Пробелы

- G1 — окружение: серверная сортировка/выдача списка (`Запрос списка чатов`, `Отсутствующие значения полей`, `Порядок записей в ответе`) не покрыта автотестом с несколькими записями разных дат; оракул: component-тест с реальным PostgreSQL и несколькими записями `TelegramChatList_Chat` с разными `Date`, проверяющий порядок в ответе; риск: низкий — LINQ-запрос простой (`OrderByDescending` перед `Select`/`ToArray`), проверен вручную на реальной БД (V7), но с одной записью в таблице порядок для нескольких записей не проверен ни автоматически, ни вручную.
- G2 — окружение: браузерный рендеринг раздела (пустой список, ошибка загрузки, прочерк для `null`, порядок строк, отсутствие действий изменения) не проверен визуально в браузере — только на уровне собранного бандла (строки в `chats.js`) и HTTP-ответа API; тест-раннера для `frontend/**` и e2e в проекте нет (`testing.md`); оракул: ручное открытие `/telegram-chat-list` в браузере с несколькими записями (включая `null`-поля и пустой список) и с симуляцией сетевой ошибки; риск: низкий — код `chats.tsx` структурно идентичен проверенному образцу `Cron.WebUi/frontend/tasks.tsx` (D3), логика прочерков и пустого списка проста и линейно читается из кода.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "периметр change-set: каждый файл объяснён", result: PASS, evidence: "git diff 9d4c492...HEAD --stat — все 18 файлов сопоставлены с задачами/дизайном/спеками" }
  - { id: V2, purpose: "все задачи tasks.md выполнены", result: PASS, evidence: "cow status --change chat-list-ui-c --json — tasks.done=19/19" }
  - { id: V3, purpose: "сортировка списка чатов по Date убыв. в запросе к БД (D2)", result: PASS, evidence: "чтение TelegramChatListWebApiPlugin.cs — OrderByDescending до Select/ToArray" }
  - { id: V4, purpose: "регрессия unit-тестов", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39 passed" }
  - { id: V5, purpose: "типы клиентской части раздела", result: PASS, evidence: "npx tsc -p tsconfig.json в ThinkingHome.Plugins.TelegramChatList.WebUi — 0 ошибок" }
  - { id: V6, purpose: "сборка решения целиком", result: PASS, evidence: "dotnet build ThinkingHome.sln — Build succeeded, 0 Warning(s), 0 Error(s)" }
  - { id: V7, purpose: "раздел доступен в запущенном приложении, API возвращает данные с null-полями", result: PASS, evidence: "dotnet run на порту 8090 + PostgreSQL (podman); curl /api/telegram-chat-list/web-api/list — 200 с login/firstName/lastName=null; curl /api/webui/meta — содержит /telegram-chat-list; chats.js и main.js содержат ожидаемые строки" }
  - { id: V8, purpose: "структура проекта повторяет образец Cron.WebUi", result: PASS, evidence: "diff .csproj образца и нового проекта — единственное отличие Description" }
  - { id: V9, purpose: "локализация en/ru содержит все ключи lang.ts", result: PASS, evidence: "чтение Lang/*.resx — все 9 ключей присутствуют в обоих файлах" }
  - { id: V10, purpose: "wiring: регистрация нового модуля во всех местах образца", result: PASS, evidence: "git diff — записи в ThinkingHome.sln, Console.csproj, appsettings.json присутствуют; packet.wiring.gaps пуст" }
gaps:
  - { id: G1, environment: "component-тест с PostgreSQL и несколькими записями TelegramChatList_Chat разных дат", oracle: "порядок записей в ответе /api/telegram-chat-list/web-api/list строго по убыванию date", risk: "низкий: запрос — один OrderByDescending перед Select/ToArray, проверен вручную на реальной БД с одной записью" }
  - { id: G2, environment: "браузер с открытой страницей /telegram-chat-list и данными: пустой список, ошибка сети, записи с null-полями", oracle: "визуальное отображение таблицы/прочерков/сообщения о пустом списке/уведомления об ошибке из требований spec.md", risk: "низкий: код chats.tsx структурно идентичен проверенному образцу Cron.WebUi/frontend/tasks.tsx" }
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "npx tsc -p tsconfig.json (ThinkingHome.Plugins.TelegramChatList.WebUi) — 0 ошибок"
  - "dotnet build ThinkingHome.sln — Build succeeded"
  - "ручной запуск ThinkingHome.Console на порту 8090 + PostgreSQL (podman) — GET /api/telegram-chat-list/web-api/list 200, GET /api/webui/meta 200 с /telegram-chat-list"
```
