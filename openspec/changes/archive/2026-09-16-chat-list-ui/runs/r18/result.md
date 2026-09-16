## Верификация: chat-list-ui

| Измерение | Результат |
|---|---|
| Полнота | 26/26 задач (`cow status`), 9/9 утверждений дельт имеют реализацию в коде (8 — `plugins/telegram-chat-list/web-ui`, 1 — `plugins/telegram-chat-list/http-api`) |
| Корректность | тесты: 39/39 зелёных (регрессия, новых автотестов нет по `coverage.yaml`); сборка решения: 2 прогона, 0 ошибок и 0 предупреждений; типы: `tsc` нового проекта и оболочки — 0 ошибок; 15/15 сценариев дельт помечены `manual` в `coverage.yaml`, вживую (PostgreSQL + браузер) не прогонялись |
| Согласованность | решения D1–D10 видны в коде; одно расхождение со стилем `conventions.md` (скобки и форма namespace в новом C#-файле — копия образца `Cron.WebUi`), одно известное и описанное в `design.md` последствие для `url-validation` |

### Периметр

Все 18 файлов запечатанного change-set объяснены (`git diff f471e65`):

- `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` — утверждение «Список сохранённых чатов» (порядок по убыванию `date`), D3, задача 1.1; `.../WebApi/README.md` — задача 1.2.
- `ThinkingHome.Plugins.TelegramChatList.WebUi/{ThinkingHome.Plugins.TelegramChatList.WebUi.csproj, package.json, package-lock.json, tsconfig.json}` — каркас проекта (D1, D9), задачи 2.1–2.3.
- `.../WebUi/TelegramChatListWebUiPlugin.cs` — регистрация раздела `/telegram-chat-list` (D2), задачи 3.1–3.2; `.../WebUi/Lang/*.resx` — «Локализация раздела списка чатов» (D8), задача 3.3.
- `.../WebUi/frontend/{api.ts, lang.ts, chats.tsx}` — утверждения «Зависимость от HTTP API», «Раздел списка чатов», «Порядок вывода чатов», «Состояние пустого списка», «Отсутствующие значения полей», «Ошибка загрузки» (D4, D5, D7), задачи 4.1–4.9.
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — «Переход в раздел с корневой страницы» (D6), задача 5.1.
- `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json`, корневой `README.md`, `.../WebUi/README.md` — поставка и документация (D10), задачи 2.4, 6.1–6.4.

Необъяснённых файлов нет. Неотслеживаемые файлы проекта совпадают ровно с 11 добавленными файлами change-set; `Resources/app/**`, `bin`, `obj`, `node_modules` закрыты `.gitignore` (`git check-ignore -v`).

### Проверки

- V1 PASS — периметр change-set: `git diff --stat f471e65` + `git status --porcelain -uall ThinkingHome.Plugins.TelegramChatList.WebUi/` → 18 файлов change-set, каждый сопоставлен утверждению, решению дизайна или задаче; посторонних файлов нет.
- V2 PASS — рабочая копия не изменена проверками: пересчёт sha256 всех файлов из `cow changeset show` после сборки → «files: 18 mismatched: 0».
- V3 PASS — задачи закрыты: `cow status --change chat-list-ui --json` → `tasks: {total: 26, done: 26, remaining: 0}`, гейты proposal/plan/tests approved.
- V4 PASS — артефакты изменения валидны: `cow validate --change chat-list-ui --json` → `{"ok": true, "valid": true, "diagnostics": []}`.
- V5 PASS — регрессия C#: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → «Passed! - Failed: 0, Passed: 39, Skipped: 0, Total: 39».
- V6 PASS — сборка решения: `dotnet build ThinkingHome.sln` дважды подряд → оба раза «Build succeeded. 0 Warning(s) 0 Error(s)»; в логе `[th-build] ✓ chats → Resources/app/chats.js` и пересборка бандлов оболочки.
- V7 PASS — типы TS: `npx tsc -p tsconfig.json` в `ThinkingHome.Plugins.TelegramChatList.WebUi` → exit 0; то же в `ThinkingHome.Plugins.WebUi` (правка `Application.tsx`) → exit 0.
- V8 PASS — консистентность lock-файла: `npm ci --dry-run` в каталоге нового проекта → «up to date in 155ms», ошибок рассинхронизации нет.
- V9 PASS — утверждение «Раздел списка чатов» (регистрация): рефлексия по собранной DLL (временный проект в `/tmp`, вызов методов с `[ConfigureWebUi]` через настоящий `WebUiConfigurationBuilder`) → зарегистрирована 1 страница: `document=/telegram-chat-list`, `js=/static/webui/js/9eb62866a1b6782ac1a85d4ebdc74395.js`; все три ресурса `StaticResource` (`…Resources.app.chats.js`, `.gz`, `.br`) присутствуют в сборке (`resource present: True`).
- V10 PASS — утверждение «Зависимость от HTTP API списка чатов» (сторона зависимостей): `GetReferencedAssemblies()` собранной `ThinkingHome.Plugins.TelegramChatList.WebUi.dll` → `System.Runtime, ThinkingHome.Core.Plugins, ThinkingHome.Plugins.WebServer, ThinkingHome.Plugins.WebUi`; ссылок на `ThinkingHome.Plugins.Database` и доменный плагин нет, прямое обращение к БД невозможно. Адрес данных в `frontend/api.ts`: `/api/telegram-chat-list/web-api/list` (единственный запрос раздела, `chats.js` содержит его 1 раз).
- V11 PASS — утверждение «Локализация раздела списка чатов» (серверная часть): `ResourceManager("ThinkingHome.Plugins.TelegramChatList.WebUi.Lang.TelegramChatListWebUiPlugin", asm)` по собранной DLL → нейтральный и `ru-RU` наборы содержат одни и те же 9 ключей `title,id,login,chatId,firstName,lastName,date,emptyList,errorLoad`, значения: `title` en='Telegram chats' ru='Чаты Telegram', `emptyList` en='There are no chats yet' ru='Чатов пока нет', `errorLoad` en='Failed to load data' ru='Не удалось загрузить данные'; сателлит `ru-RU/ThinkingHome.Plugins.TelegramChatList.WebUi.resources.dll` лежит и в `bin` проекта, и в `ThinkingHome.Console/bin`. Набор ключей совпадает с `Keyset('en', …)` в `frontend/lang.ts` (9 ключей, те же имена и английские значения).
- V12 PARTIAL — утверждение «Список сохранённых чатов» (порядок по убыванию `date`): выражение из `GetChatList` (`db.Set<Chat>().OrderByDescending(x => x.Date).Select(…)`) прогнано через настоящую модель EF Core (мэппинг взят из продуктового метода `TelegramChatListPlugin.InitModel` с `[DbModelBuilder]`, провайдер Npgsql) и напечатано `ToQueryString()` → `SELECT t."Id" AS id, t."Login" AS login, t."ChatId" AS "chatId", t."FirstName" AS "firstName", t."LastName" AS "lastName", t."Date" AS date FROM "TelegramChatList_Chat" AS t ORDER BY t."Date" DESC`. Ближайшие неверные варианты различимы: без сортировки — SQL без `ORDER BY`, `OrderBy` — `ORDER BY t."Date"` без `DESC`. PARTIAL: SQL сгенерирован для копии выражения (сам `GetChatList` приватен и требует `DatabasePlugin.OpenSession()`), запрос к работающему ресурсу не выполнялся.
- V13 PASS — утверждения «Порядок вывода чатов», «Состояние пустого списка чатов», «Отсутствующие значения полей чата», «Ошибка загрузки списка чатов» на уровне кода: `frontend/chats.tsx` рендерит `list.map(...)` без сортировки и без обработчиков на `Table.Th`; при `list.length === 0` вместо `Table` рендерится `<Text c="dimmed">{t('emptyList')}</Text>` при сохранённом `<Title>`; `chat.login ?? <EmptyValue/>` (и то же для `firstName`, `lastName`) даёт прочерк «—»; в ветке ошибки `logger.log(LogLevel.Error, …)` + `toaster.showError(t('errorLoad'))`, `list` остаётся `undefined`, компонент возвращает `null`; отмена по `AbortSignal` ошибкой не считается (`if (signal?.aborted) return;`). Кнопок, форм и модальных окон в разделе нет — действий над чатами нет.
- V14 PASS — утверждение «Переход в раздел списка чатов с корневой страницы»: в `Application.tsx` добавлен `<Anchor component={Link} to="/telegram-chat-list">Telegram chats</Anchor>` в списке `Home`; пересобранный бандл оболочки `ThinkingHome.Plugins.WebUi/Resources/app/main.js` содержит `telegram-chat-list` и `Telegram chats`.
- V15 PASS — запрет бандлить внешние библиотеки (`conventions.md`, «Запрещено»): в собранном `Resources/app/chats.js` импорты остались внешними — `react`, `@mantine/core`, `@thinking-home/ui`, `@thinking-home/i18n`; `Resources/app/**` не отслеживается git.
- V16 PARTIAL — единообразие с образцом `Cron.WebUi`: `.csproj`, `package.json`, `tsconfig.json`, класс плагина, `api.ts`/`lang.ts`/компонент повторяют образец файл в файл (сверено `diff`-ом по содержимому); расхождение с `conventions.md`, «Стиль» («в новых файлах открывающая скобка класса на той же строке»): новый `TelegramChatListWebUiPlugin.cs` использует блочный `namespace { }` и скобки на отдельной строке — ровно как копируемый `CronWebUiPlugin.cs`, тогда как соседний новый код проекта (например, `TelegramChatListWebApiPlugin.cs`) использует file-scoped namespace. Функционально не влияет; решение — за ревьюером.
- V17 PARTIAL — отчёт `/dynamic/web-server/url-validation/errors.txt` (риск из `design.md`): вживую не снят (нельзя поднять хост, см. G1). Статический разбор `UrlValidationPlugin.ValidateDynamicResource/ValidateStaticResource` и `WebUiPlugin.RegisterHttpHandlers` показывает, что документ раздела и бандл регистрирует `WebUiPlugin` (alias `web-ui`), поэтому добавятся ровно две строки вида `invalid url prefix: /telegram-chat-list` и `invalid url prefix: /static/webui/js/{hash}.js` — тот же вид, что уже есть у `/cron`, `/scripts`, `/page1`. Новых видов ошибок из кода не следует.
- V18 NOT_RUN — ручные проверки 1–3 из `test-plan.md` (состав ответа, порядок записей, `null`-поля у работающего `/api/telegram-chat-list/web-api/list`): нет PostgreSQL (`podman` machine не запущена: «Cannot connect to Podman», на 5432 никто не слушает), хост без БД не стартует.
- V19 NOT_RUN — ручные проверки 4–15 из `test-plan.md` (раздел в браузере: таблица со всеми полями, порядок строк = порядок ответа, отсутствие действий и средств сортировки, пустой список, прочерки, уведомление об ошибке, переход с корневой страницы, русская и английская локали): нет запущенного хоста и браузерного стенда; тест-раннера для `frontend/**` и e2e в проекте нет (`testing.md`).
- V20 PASS — покрытие: в `coverage.yaml` все 15 сценариев обеих дельт помечены `manual` с обоснованием, каждому соответствует проверка 1–15 в `test-plan.md`; автотестов по дельтам нет — это согласовано на гейте tests. Зелёных автотестов, покрывающих сценарии дельт, нет ни одного.

### Пробелы

- G1 — окружение: запущенный PostgreSQL (контейнер `postgres`) и хост `ThinkingHome.Console`; оракул: ответ `GET /api/telegram-chat-list/web-api/list` — состав полей, `null` у незаполненных полей и порядок записей по убыванию `date`; риск: низкий — SQL-трансляция выражения проверена (V12, `ORDER BY t."Date" DESC`), состав полей проекции не менялся, но фактический ответ работающего ресурса не наблюдался.
- G2 — окружение: браузер с открытым разделом `/telegram-chat-list` на запущенном хосте (данные набора A и пустая таблица, `culture: ru-RU` и `en-US`); оракул: проверки 4–15 `test-plan.md` (таблица, порядок строк, отсутствие действий и сортировки, пустое состояние, прочерки, уведомление об ошибке, переход с корневой страницы, языки); риск: средний — поведение раздела подтверждено только чтением кода, `tsc` и сборкой бандла; автотестов клиентской части в проекте нет, регрессия ловится только вручную. Отдельно не проверено рантайм-поведение `Intl.DateTimeFormat(lang || undefined)` (формат даты, D4) и то, что оболочка отдаёт языковой пакет раздела по `/api/webui/lang`.
- G3 — окружение: запущенный хост; оракул: `/dynamic/web-server/url-validation/errors.txt` в сравнении с состоянием до изменения; риск: низкий — по коду валидатора добавляются две строки уже существующего вида (V17), новых видов ошибок не ожидается.

```yaml
# cow-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "периметр: каждый файл change-set объяснён", result: PASS, evidence: "git diff --stat f471e65 + git status -uall — 18 файлов, посторонних нет" }
  - { id: V2, purpose: "рабочая копия не изменена проверками", result: PASS, evidence: "пересчёт sha256 по cow changeset show — files: 18, mismatched: 0" }
  - { id: V3, purpose: "все задачи tasks.md отмечены", result: PASS, evidence: "cow status --json — tasks 26/26, remaining 0" }
  - { id: V4, purpose: "артефакты изменения валидны", result: PASS, evidence: "cow validate --json — ok: true, valid: true, diagnostics: []" }
  - { id: V5, purpose: "регрессия существующих тестов", result: PASS, evidence: "dotnet test ThinkingHome.Tests — Passed! Failed: 0, Passed: 39" }
  - { id: V6, purpose: "сборка решения, включая бандлы", result: PASS, evidence: "dotnet build ThinkingHome.sln дважды — Build succeeded, 0 Warning(s), 0 Error(s); [th-build] ✓ chats → Resources/app/chats.js" }
  - { id: V7, purpose: "проверка типов TS раздела и оболочки", result: PASS, evidence: "npx tsc -p tsconfig.json в TelegramChatList.WebUi и в WebUi — exit 0" }
  - { id: V8, purpose: "package-lock.json синхронен с package.json", result: PASS, evidence: "npm ci --dry-run — up to date in 155ms" }
  - { id: V9, purpose: "утверждение «Раздел списка чатов»: регистрация /telegram-chat-list и бандл", result: PASS, evidence: "рефлексия по собранной DLL: 1 страница, document=/telegram-chat-list, js=/static/webui/js/9eb62866….js, ресурсы chats.js/.gz/.br присутствуют" }
  - { id: V10, purpose: "утверждение «Зависимость от HTTP API списка чатов»", result: PASS, evidence: "GetReferencedAssemblies DLL: Core.Plugins, WebServer, WebUi (без Database и доменного плагина); frontend/api.ts — /api/telegram-chat-list/web-api/list" }
  - { id: V11, purpose: "утверждение «Локализация раздела списка чатов» (ресурсы сервера)", result: PASS, evidence: "ResourceManager по DLL: 9 ключей в нейтральном и ru-RU наборах, ru title='Чаты Telegram', emptyList='Чатов пока нет', errorLoad='Не удалось загрузить данные'; ключи совпадают с Keyset в lang.ts" }
  - { id: V12, purpose: "утверждение «Список сохранённых чатов»: порядок по убыванию date", result: PARTIAL, evidence: "EF Core ToQueryString по модели из [DbModelBuilder]: ORDER BY t.\"Date\" DESC; неверные варианты дают SQL без ORDER BY и без DESC; сам GetChatList на живой базе не вызывался" }
  - { id: V13, purpose: "утверждения «Порядок вывода», «Пустой список», «Отсутствующие значения», «Ошибка загрузки» на уровне кода", result: PASS, evidence: "frontend/chats.tsx: list.map без сортировки, ветка list.length с Text(emptyList), ?? <EmptyValue/>, toaster.showError + logger, отмена по AbortSignal не ошибка" }
  - { id: V14, purpose: "утверждение «Переход в раздел с корневой страницы»", result: PASS, evidence: "Application.tsx: Anchor to=\"/telegram-chat-list\"; в пересобранном main.js есть telegram-chat-list и Telegram chats" }
  - { id: V15, purpose: "запрет бандлить react, Mantine, @thinking-home/ui", result: PASS, evidence: "chats.js: import из \"react\", \"@mantine/core\", \"@thinking-home/ui\", \"@thinking-home/i18n\" остались внешними; Resources/app игнорируется git" }
  - { id: V16, purpose: "единообразие с образцом Cron.WebUi и conventions.md", result: PARTIAL, evidence: "состав и содержимое файлов повторяют образец; новый .cs использует блочный namespace и скобки на новой строке (как образец), что расходится с conventions.md «в новых файлах скобка на той же строке»" }
  - { id: V17, purpose: "отчёт url-validation без новых видов ошибок", result: PARTIAL, evidence: "статический разбор UrlValidationPlugin и WebUiPlugin: добавятся две строки invalid url prefix того же вида, что у /cron и /scripts; вживую отчёт не снят" }
  - { id: V18, purpose: "ручные проверки 1–3: ответ HTTP API на живой базе", result: NOT_RUN, evidence: "нет PostgreSQL: podman machine не запущена, порт 5432 не слушается; хост без БД не стартует" }
  - { id: V19, purpose: "ручные проверки 4–15: раздел в браузере, локали, пустое состояние", result: NOT_RUN, evidence: "нет запущенного хоста и браузерного стенда; тест-раннера для frontend и e2e в проекте нет (testing.md)" }
  - { id: V20, purpose: "покрытие сценариев дельт тестами или пометкой manual", result: PASS, evidence: "coverage.yaml: 15/15 сценариев с manual и обоснованием, каждому соответствует проверка в test-plan.md; автотестов по дельтам нет" }
gaps:
  - { id: G1, environment: "PostgreSQL (контейнер postgres) и запущенный ThinkingHome.Console", oracle: "ответ GET /api/telegram-chat-list/web-api/list: состав полей, null у незаполненных, порядок по убыванию date", risk: "низкий: SQL-трансляция проверена (ORDER BY \"Date\" DESC), состав проекции не менялся" }
  - { id: G2, environment: "браузер + запущенный хост, данные набора A, пустая таблица, culture ru-RU и en-US", oracle: "проверки 4–15 test-plan.md: таблица со всеми полями, порядок строк = порядок ответа, отсутствие действий и сортировки, пустое состояние, прочерки, уведомление об ошибке, переход с корневой страницы, языки", risk: "средний: автотестов клиентской части нет, поведение подтверждено чтением кода, tsc и сборкой бандла" }
  - { id: G3, environment: "запущенный хост", oracle: "/dynamic/web-server/url-validation/errors.txt в сравнении с состоянием до изменения", risk: "низкий: по коду валидатора добавляются две строки уже существующего вида" }
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39/39"
  - "dotnet build ThinkingHome.sln (дважды) — 0 ошибок, 0 предупреждений"
  - "npx tsc -p tsconfig.json (TelegramChatList.WebUi, WebUi) — 0 ошибок"
  - "npm ci --dry-run (TelegramChatList.WebUi) — lock-файл синхронен"
  - "cow validate --change chat-list-ui — ok, diagnostics: []"
  - "рефлексия по собранной DLL — страница /telegram-chat-list, ресурсы бандла и 9 ключей локализации (en/ru-RU)"
  - "EF Core ToQueryString — ORDER BY t.\"Date\" DESC для выражения из GetChatList"
```
