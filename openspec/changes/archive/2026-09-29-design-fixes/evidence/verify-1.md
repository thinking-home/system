## Верификация: design-fixes

| Измерение | Результат |
|---|---|
| Полнота | 15/15 задач, 17/17 сценариев имеют реализацию; сценарии с подменой API остаются ручными |
| Корректность | TypeScript: 4/4 проектов успешно; .NET: 43/43; полная сборка: 0 ошибок и 0 предупреждений; браузерная проверка выявила 404 |
| Согласованность | Запечатанный change-set без drift; все 14 файлов объяснимы реализацией, локализацией, зависимостью Mantine или evidence; найдена ошибка сетевого запроса страницы |

### Проверки

- V1 PASS — периметр запечатанного change-set: `sbox changeset show --change design-fixes --json`, `git diff b85ea73b747746704b514d869ff2f5a70b5ba805` → 14 файлов, digest `sha256:3ba41ec…42327b60`, `drifted: false`; все файлы соответствуют утверждениям, решениям дизайна или необходимой поддержке.
- V2 PASS — завершённость задач: `sbox status --change design-fixes --json` → `tasks: total 15, done 15, remaining 0`.
- V3 PASS — состояния пяти асинхронных списков: поиск в `list.tsx`, `subscriptions.tsx`, `tasks.tsx`, `chats.tsx`, `page2.tsx` → отдельные `loading/ready/error` (и `cancelled` для Tmp), ready-пустые списки отображают `Text c="dimmed" ta="center"`, error скрывает таблицу и сохраняет toast в четырёх серверных списках.
- V4 PASS — агрегирование загрузки подписок: `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` → `Promise.all` для подписок, сценариев и событий; единый обработчик ошибки переводит страницу в `error` и вызывает один `toaster.showError`.
- V5 PASS — редактор meta-фильтра и заголовки шторок: `sbox-browser goto http://127.0.0.1:8080/scripts/subscriptions`, `snapshot`, `click` → шторка содержит единственный `h2` «Новая подписка», сообщение «Правил фильтра пока нет» и доступную кнопку «Добавить строку»; после нажатия сообщение заменяется редактируемой строкой. Код обеих шторок использует `styles.title` с `--mantine-h2-*`.
- V6 PASS — шторка cron: `sbox-browser goto http://127.0.0.1:8080/cron`, `snapshot`, `click e3` → маршрут отвечает 200, в шторке ровно один `h2` «Новая запись`; скриншот: `/Users/dima117a/.sbox/browser/shots/default-20260929-183941.png`.
- V7 PASS — типы UI-проектов: `npx tsc -p tsconfig.json` в `Scripts.WebUi`, `Cron.WebUi`, `TelegramChatList.WebUi`, `Tmp` → 4 успешных запуска.
- V8 PASS — unit-тесты: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed: 43, Failed: 0, Skipped: 0`.
- V9 PASS — полная сборка: `dotnet build ThinkingHome.sln` → `Build succeeded`, `0 Warning(s)`, `0 Error(s)`; собраны все четыре изменённые UI-сборки.
- V10 PASS — структурная корректность артефактов: `sbox-contract validate --delta openspec/changes/design-fixes/specs --json`, `sbox validate --change design-fixes --json`, `git diff --check` → диагностик и ошибок пробелов нет.
- V11 FAIL — отсутствие browser-консольных и сетевых ошибок на затронутых страницах: `sbox-browser console --errors --json`, `sbox-browser requests --json` после открытия `/cron` и `/scripts/subscriptions` → `GET /favicon.ico` возвращает 404 и записан как console error `Failed to load resource`.
- V12 NOT_RUN — пустые, ошибочные и отменённые варианты всех API-списков: test-plan требует удержания и подмены ответов `/api/scripts/web-api/*`, `/api/cron/web-api/list`, `/api/telegram-chat-list/web-api/list`, `/api/tmp/pigs` → в запущенном приложении нет настроенного прокси или DevTools-моков для управляемой подмены ответов.

### Пробелы

- G1 — окружение: браузерная подмена ответов API; оракул: 14 ручных сценариев empty/error/cancel из `coverage.yaml` и `test-plan.md`; риск: средний, поскольку статическая реализация, типизация и сборка подтверждены, но ветки невозможно наблюдать без управляемых ответов.
- G2 — окружение: запущенные `/cron` и `/scripts/subscriptions`; оракул: отсутствие 4xx/5xx и console errors; риск: средний, поскольку подтверждён 404 `/favicon.ico`, нарушающий обязательную browser-проверку.

```yaml
# sbox-result
status: заблокировано
blocker: { category: реализация, artifact: tasks, message: "На затронутых страницах браузер фиксирует 404 /favicon.ico и console error." }
checks:
  - { id: V1, purpose: "периметр запечатанного change-set", result: PASS, evidence: "sbox changeset show --change design-fixes --json — 14 файлов, drifted: false, digest sha256:3ba41ec…42327b60" }
  - { id: V2, purpose: "все задачи tasks.md отмечены", result: PASS, evidence: "sbox status --change design-fixes --json — 15/15, remaining 0" }
  - { id: V3, purpose: "утверждения о состояниях пяти списков", result: PASS, evidence: "код пяти UI-компонентов содержит status и взаимно исключающие loading/ready/error/empty ветки" }
  - { id: V4, purpose: "единый исход загрузки страницы подписок", result: PASS, evidence: "subscriptions.tsx — Promise.all трёх обязательных запросов и один error-handler" }
  - { id: V5, purpose: "пустой редактор meta-фильтра и шторка подписки", result: PASS, evidence: "sbox-browser snapshot — h2, «Правил фильтра пока нет», кнопка добавления; click добавляет редактируемую строку" }
  - { id: V6, purpose: "заголовок шторки cron", result: PASS, evidence: "sbox-browser /cron → 200; snapshot после click e3 содержит один h2 «Новая запись»" }
  - { id: V7, purpose: "TypeScript-проверка UI", result: PASS, evidence: "npx tsc -p tsconfig.json — 4/4 успешных запуска" }
  - { id: V8, purpose: "unit-тесты", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43" }
  - { id: V9, purpose: "полная сборка", result: PASS, evidence: "dotnet build ThinkingHome.sln — 0 Warning(s), 0 Error(s)" }
  - { id: V10, purpose: "валидность дельт и change-артефактов", result: PASS, evidence: "sbox-contract validate и sbox validate — diagnostics: []" }
  - { id: V11, purpose: "отсутствие browser console и 4xx/5xx на затронутых страницах", result: FAIL, evidence: "sbox-browser console --errors и requests — GET /favicon.ico: 404, Failed to load resource" }
  - { id: V12, purpose: "ручные сценарии empty/error/cancel", result: NOT_RUN, evidence: "нет прокси или DevTools-моков для подмены API-ответов" }
gaps:
  - { id: G1, environment: "браузерная подмена API-ответов", oracle: "14 сценариев empty/error/cancel из coverage.yaml", risk: "средний: ветки не наблюдались при управляемых ответах" }
  - { id: G2, environment: "запущенные страницы /cron и /scripts/subscriptions", oracle: "отсутствие 4xx/5xx и console errors", risk: "средний: обнаружен 404 /favicon.ico" }
verified:
  - "sbox changeset show — drifted: false"
  - "npx tsc -p tsconfig.json — 4/4"
  - "dotnet test — 43/43"
  - "dotnet build ThinkingHome.sln — 0 warnings, 0 errors"
  - "sbox-contract validate и sbox validate — diagnostics: []"
```
