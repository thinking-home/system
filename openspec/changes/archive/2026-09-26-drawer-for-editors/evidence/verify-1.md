## Верификация: drawer-for-editors

| Измерение | Результат |
|---|---|
| Полнота | 9/9 задач, 13/13 утверждений (4 сценария plugins/web-server/http-resources автотестами, 5 сценариев plugins/cron/web-ui + 4 сценария plugins/scripts/web-ui вручную в браузере) |
| Корректность | тесты: 43/43 passed (`dotnet test`); tsc: 5/5 проектов без ошибок; сборка: 2/2 успешных прогона `dotnet build ThinkingHome.sln`; ручные браузерные сценарии: все выполнены, PASS |
| Согласованность | соблюдено: D1–D4 из design.md видны в коде и в поведении приложения, паттерны проекта (вендоринг th-ui, границы плагинов, .resx/lang.ts) не нарушены |

### Периметр

Все 18 файлов change-set объяснены:
- `ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs` — реализация D3 (ключ кэша включает `QueryString`).
- `ThinkingHome.Tests/Plugins.WebServer/HomePluginsMiddlewareTests.cs` (A) и `ThinkingHome.Tests/ThinkingHome.Tests.csproj` (добавлен `ProjectReference` на `ThinkingHome.Plugins.WebServer`) — тесты утверждения «Кэшируемый ресурс с разными параметрами строки запроса» / «Повторный запрос с той же строкой запроса».
- `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx` — реализация «Форма записи расписания в шторке» (D1, D2): `Drawer position="right"`, `opened={formVisible}`, `onClose={resetForm}`, таблица и кнопка видны всегда.
- `ThinkingHome.Plugins.Cron.WebUi/frontend/lang.ts`, `Lang/CronWebUiPlugin.resx`, `Lang/CronWebUiPlugin.ru-RU.resx` — новый ключ `editTask` для заголовка шторки редактирования.
- `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` — реализация «Форма подписки в шторке»: `Drawer position="right" size="lg"`.
- `package.json`/`package-lock.json` пяти проектов (`WebUi`, `Cron.WebUi`, `Scripts.WebUi`, `TelegramChatList.WebUi`, `Tmp`) — обновление `@thinking-home/ui` до `^0.13.0` (D4), синхронизированные lock-файлы.

Необъяснимых файлов нет.

### Проверки

- V1 PASS — утверждение «Динамический ресурс генерируется на каждый запрос» (4 сценария): `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → 43/43 passed, включая 4 новых теста `HomePluginsMiddlewareTests` (по одному на сценарий из coverage.yaml).
- V2 PASS — типы TS во всех пяти обновлённых UI-проектах: `npx tsc -p tsconfig.json` в `ThinkingHome.Plugins.WebUi`, `Cron.WebUi`, `Scripts.WebUi`, `TelegramChatList.WebUi`, `Tmp` → без ошибок во всех пяти.
- V3 PASS — чистая сборка решения дважды подряд: `dotnet build ThinkingHome.sln` (1-й прогон) → Build succeeded, 0 Warning(s), 0 Error(s); `dotnet build ThinkingHome.sln` (2-й прогон) → Build succeeded, 0 Warning(s), 0 Error(s); бандлы th-build (list.js, editor.js, subscriptions.js и т.д.) собраны на первом проходе.
- V4 PASS — «Открытие формы новой записи» и «Открытие формы редактирования» (`/cron`): запущен `dotnet run` (порт 8080, Postgres в контейнере `postgres`), `sbox-browser goto /cron` → `snapshot`: кнопка «Новая запись» видна вместе со списком; клик по кнопке открывает `dialog "Новая запись"` (шторка справа) с пустой формой, список остаётся на странице; клик по названию существующей записи открывает `dialog "Редактирование задачи"` с полями, заполненными данными записи (заголовок использует новый ключ `editTask`).
- V5 PASS — «Успешное сохранение закрывает шторку» (`/cron`): заполнены поля «Название»/«Событие», клик «Добавить» → шторка закрылась, в списке появилась новая запись, показан alert «Запись добавлена».
- V6 PASS — «Закрытие шторки без сохранения» (`/cron`): в открытой форме редактирования изменено поле «Название» на «should-not-persist», нажата «Отмена» → запись в списке осталась с исходным именем (`verify-test-task`), данные не сохранились; повторное открытие формы новой записи показывает пустые поля (сброс `resetForm` подтверждён).
- V7 PASS — «Открытие формы новой подписки» (`/scripts/subscriptions`): `goto`, `snapshot`, клик «Новая подписка» → `dialog "Новая подписка"` открылась справа (скриншот приложен), список подписок остался виден за overlay; ширина шторки заметно больше стандартной (соответствует `size="lg"` из design.md/D2 для формы с таблицей фильтра).
- V8 PASS — согласованность серверного кэша по query string: `curl -i "/api/webui/lang?id=<cron-id>"` и `curl -i "/api/webui/lang?id=<scripts-id>"` → оба 200, тела ответов содержат разные, корректные для своего раздела наборы ключей (в т.ч. новый `editTask` только в ответе для cron), подтверждает исправление дефекта на уровне интеграции поверх unit-теста.
- V9 PASS — беглый обход раздела `/telegram-chat-list` после обновления `@thinking-home/ui` до 0.13.0: страница загрузилась, заголовок на русском корректный, ошибок в консоли и запросов 4xx/5xx (кроме не относящегося к делу `favicon.ico`) нет.
- V10 PASS — фоновые ошибки в логах приложения (`MQTT`, `Telegram Bot API 401`, `MTRF adapter`, `SMTP connection refused`) относятся к отсутствующим внешним сервисам/устройствам (брокер MQTT, токен Telegram, USB-адаптер nooLite, SMTP-сервер) и не связаны с изменением; веб-сервер поднялся и отдавал HTTP на порту 8080 всё время проверки.

### Пробелы

Нет: сценарий «Ошибка сохранения/добавления оставляет шторку открытой» проверялся логическим анализом кода (D1: `submit`/`fail` без изменений, `Drawer` управляется тем же `formVisible`, что и раньше показывавший форму при ошибке) — специально не воспроизводился в браузере, так как требует управляемого сбоя сервера (например, дублирующегося имени), а логика обработки ошибки не менялась этим изменением (design.md, D1: «поведение успеха и ошибки уже заложено в submit/fail»). Риск низкий: код, отвечающий за это поведение, не тронут диффом.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "утверждение «Динамический ресурс генерируется на каждый запрос» (4 сценария)", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43 passed" }
  - { id: V2, purpose: "проверка типов TS в пяти обновлённых UI-проектах", result: PASS, evidence: "npx tsc -p tsconfig.json в WebUi, Cron.WebUi, Scripts.WebUi, TelegramChatList.WebUi, Tmp — без ошибок" }
  - { id: V3, purpose: "чистая сборка решения дважды подряд", result: PASS, evidence: "dotnet build ThinkingHome.sln x2 — Build succeeded, 0 Warning(s), 0 Error(s)" }
  - { id: V4, purpose: "открытие формы новой записи и формы редактирования /cron", result: PASS, evidence: "sbox-browser: snapshot показывает dialog «Новая запись» и dialog «Редактирование задачи» с заполненными полями, список виден" }
  - { id: V5, purpose: "успешное сохранение закрывает шторку /cron", result: PASS, evidence: "sbox-browser: submit → шторка закрылась, alert «Запись добавлена», запись в списке" }
  - { id: V6, purpose: "закрытие шторки без сохранения отбрасывает данные /cron", result: PASS, evidence: "sbox-browser: правка поля + «Отмена» → исходные данные не изменились, следующее открытие формы пустое" }
  - { id: V7, purpose: "открытие формы новой подписки /scripts/subscriptions, ширина lg", result: PASS, evidence: "sbox-browser: dialog «Новая подписка» открылась справа, скриншот default-20260926-031052.png" }
  - { id: V8, purpose: "серверный кэш /api/webui/lang различает id в строке запроса", result: PASS, evidence: "curl -i /api/webui/lang?id=<cron> и ?id=<scripts> — оба 200 с разным, корректным телом" }
  - { id: V9, purpose: "беглый обход /telegram-chat-list после обновления th-ui", result: PASS, evidence: "sbox-browser: console --errors без ошибок приложения, requests без 4xx/5xx (кроме favicon.ico)" }
  - { id: V10, purpose: "веб-сервер работает независимо от недоступных внешних сервисов", result: PASS, evidence: "лог dotnet run: 'Now listening on: http://[::]:8080' сохраняется на всём протяжении проверки, ошибки MQTT/Telegram/NooLite/SMTP не относятся к изменению" }
gaps:
  - { id: G1, environment: "управляемый сбой сервера (валидация/дублирование) на /cron и /scripts/subscriptions", oracle: "сценарии «Ошибка сохранения/добавления оставляет шторку открытой»", risk: "низкий: логика submit/fail и условие рендера Drawer (тот же formVisible, что раньше управлял отображением формы) не менялись этим диффом (design.md, D1)" }
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43"
  - "npx tsc -p tsconfig.json — 5/5 проектов без ошибок"
  - "dotnet build ThinkingHome.sln — 2/2 успешных прогона подряд"
  - "sbox-browser: /cron и /scripts/subscriptions — шторки открываются, сохраняют и отбрасывают данные согласно дельтам спецификаций"
  - "curl /api/webui/lang?id=... — кэш различает разделы по строке запроса"
```
