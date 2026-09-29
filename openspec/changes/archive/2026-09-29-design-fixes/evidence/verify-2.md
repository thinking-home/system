## Верификация: design-fixes

| Измерение | Результат |
|---|---|
| Полнота | 16/16 задач, 17/17 сценариев имеют реализацию и запись в `coverage.yaml` |
| Корректность | TypeScript: 4/4; .NET: 43/43; полная сборка: 0 ошибок и 0 предупреждений |
| Согласованность | Запечатанный change-set без drift; реализация соответствует D1–D7, включая подтверждённую пользователем границу `/favicon.ico` |

### Проверки

- V1 PASS — периметр: `sbox changeset show --change design-fixes --json`, `git diff --check b85ea73b747746704b514d869ff2f5a70b5ba805` → 14 запечатанных файлов, `drifted: false`, нет ошибок пробелов; файлы относятся к реализации списков, локализации, Mantine-зависимости или evidence.
- V2 PASS — задачи: `sbox status --change design-fixes --json` → `tasks: total 16, done 16, remaining 0`.
- V3 PASS — состояния списков: анализ `list.tsx`, `subscriptions.tsx`, `tasks.tsx`, `chats.tsx`, `page2.tsx` → реализованы отдельные состояния `loading/ready/error`, а в Tmp — также `cancelled`; empty/error используют центрированный серый Mantine `Text`.
- V4 PASS — подписки: `subscriptions.tsx` → начальные запросы подписок, сценариев и событий объединены в `Promise.all`; отказ любого запроса даёт единый page-level error и один обработчик toast.
- V5 PASS — meta-фильтр и шторка подписки: `sbox-browser goto /scripts/subscriptions`, `snapshot`, `click e4` → маршрут отвечает 200; шторка содержит единственный `h2`, текст «Правил фильтра пока нет» и доступную кнопку «Добавить строку». Скриншот: `/Users/dima117a/.sbox/browser/shots/default-20260929-191516.png`.
- V6 PASS — шторка cron: `sbox-browser goto /cron`, `snapshot`, `click e3` → маршрут отвечает 200; шторка содержит единственный `h2` «Новая запись».
- V7 PASS — типы UI: `npx tsc -p tsconfig.json` в Scripts.WebUi, Cron.WebUi, TelegramChatList.WebUi и Tmp → 4 успешных запуска.
- V8 PASS — unit-тесты: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → `Passed: 43, Failed: 0, Skipped: 0`.
- V9 PASS — полная сборка: `dotnet build ThinkingHome.sln` → `Build succeeded`, `0 Warning(s)`, `0 Error(s)`.
- V10 PASS — артефакты: `sbox-contract validate --delta openspec/changes/design-fixes/specs --json` и `sbox validate --change design-fixes --json` → диагностик нет.
- V11 PASS — граница D7: `sbox changeset show` и `rg "favicon|D7"` в design/tasks → change-set не меняет общую WebUi-оболочку или обработчик `/favicon.ico`; наблюдаемый `GET /favicon.ico → 404` относится к явно принятому пользователем внешнему шуму вне объёма.
- V12 NOT_RUN — empty/error/cancel API-сценарии: `coverage.yaml` и `test-plan.md` требуют подмены или удержания ответов API → в доступном `sbox-browser` нет request interception, в проекте отсутствуют TS/e2e-раннер и прокси для контролируемой подмены.

### Пробелы

- G1 — окружение: browser request interception или локальный прокси; оракул: сценарии pending/empty/error/cancel для пяти API-списков, включая одновременный отказ запросов подписок; риск: средний, поскольку ветки статически проверены, типизация и сборка проходят, но управляемые ответы API не наблюдались.
- G2 — окружение: браузерная проверка обеих тем и вычисленных CSS-значений `h2`; оракул: равенство `font-family`, `font-size`, `line-height`, `font-weight` значениям темы Mantine; риск: низкий, поскольку DOM подтверждает единственный `h2`, а код использует переменные `--mantine-h2-*`.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "периметр и целостность запечатанного change-set", result: PASS, evidence: "sbox changeset show — 14 файлов, drifted: false; git diff --check — без ошибок" }
  - { id: V2, purpose: "все задачи tasks.md отмечены", result: PASS, evidence: "sbox status — 16/16, remaining 0" }
  - { id: V3, purpose: "утверждения о состояниях пяти списков", result: PASS, evidence: "код пяти UI-компонентов содержит взаимоисключающие loading/ready/error/empty ветки; Tmp содержит cancelled" }
  - { id: V4, purpose: "единый исход загрузки подписок", result: PASS, evidence: "subscriptions.tsx — Promise.all трёх начальных запросов и единый error-handler" }
  - { id: V5, purpose: "пустой редактор meta-фильтра и шторка подписки", result: PASS, evidence: "sbox-browser /scripts/subscriptions → 200; snapshot содержит h2, empty-текст и доступную кнопку добавления" }
  - { id: V6, purpose: "заголовок шторки cron", result: PASS, evidence: "sbox-browser /cron → 200; snapshot после click содержит один h2 «Новая запись»" }
  - { id: V7, purpose: "TypeScript-проверка UI", result: PASS, evidence: "npx tsc -p tsconfig.json — 4/4 успешных запуска" }
  - { id: V8, purpose: "unit-тесты", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43" }
  - { id: V9, purpose: "полная сборка", result: PASS, evidence: "dotnet build ThinkingHome.sln — 0 Warning(s), 0 Error(s)" }
  - { id: V10, purpose: "валидность дельт и change-артефактов", result: PASS, evidence: "sbox-contract validate и sbox validate — diagnostics: []" }
  - { id: V11, purpose: "граница D7 для favicon", result: PASS, evidence: "change-set не меняет общую WebUi-оболочку; 404 /favicon.ico принят пользователем как внешний шум вне объёма" }
  - { id: V12, purpose: "ручные сценарии empty/error/cancel", result: NOT_RUN, evidence: "нет proxy, request interception и e2e/TypeScript test runner для подмены API-ответов" }
gaps:
  - { id: G1, environment: "browser request interception или локальный proxy", oracle: "pending/empty/error/cancel всех пяти API-списков и одновременный отказ запросов подписок", risk: "средний: управляемые API-ветки не наблюдались" }
  - { id: G2, environment: "браузерная проверка светлой и тёмной темы", oracle: "вычисленные стили h2 совпадают с переменными темы Mantine", risk: "низкий: DOM и использование --mantine-h2-* подтверждены" }
verified:
  - "sbox changeset show — drifted: false"
  - "npx tsc -p tsconfig.json — 4/4"
  - "dotnet test — 43/43"
  - "dotnet build ThinkingHome.sln — 0 warnings, 0 errors"
  - "sbox-contract validate и sbox validate — diagnostics: []"
```
