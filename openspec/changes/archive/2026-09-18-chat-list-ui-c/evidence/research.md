# Evidence Pack — chat-list-ui-c

## Цель
Отдельный плагин веб-интерфейса для `TelegramChatList`: страница со всеми полями таблицы чатов, без пагинации и
фильтров; ссылка на неё — на главной странице; HTTP API сортирует список по `date` по убыванию (фиксировано на
сервере).

## Текущее поведение
- HTTP API есть: `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs:14-23` — `GET
  /api/telegram-chat-list/web-api/list` отдаёт `{id, login, chatId, firstName, lastName, date}` без `OrderBy`.
- Раздела веб-интерфейса в коде нет. Каталог
  `ThinkingHome.Plugins.TelegramChatList.WebUi/Resources/app/{chats.js,*.gz,*.br,manifest.json}` существует на
  диске, но не в git (`.gitignore:30:**/Resources/app/`), без `.csproj`/`*Plugin.cs`/`frontend`/истории — чужой
  билд-артефакт, не источник истины (только намёк на имя бандла `chats.js`).
- Ссылки разделов на главной зашиты в `Home` внутри `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:24-42`
  (список `<Anchor component={Link} to="/...">` на `/scripts`, `/cron`, `/page1..3`) — не спецификация, правится
  напрямую.

## Затронутые capability
- `plugins/telegram-chat-list/http-api` (`openspec/specs/plugins/telegram-chat-list/http-api/spec.md:9-21`) — нет
  требования к порядку; нужна дельта "сортировка по `date` убыв.".
- Новая capability по образцу `plugins/cron/web-ui` — раздел UI для списка чатов; сейчас отсутствует в коде и
  спецификациях.
- `plugins/web-ui/page-registration`, `plugins/web-ui/application-shell` — контракт не меняется, раздел лишь
  использует существующий `[ConfigureWebUi]`/`RegisterPage`.

## Границы и владение
- `TelegramChatList` (хранение) не трогается; правки — в `.WebApi` (сортировка) и новом `.WebUi` проекте.
- Доменный плагин не ссылается на `WebServer`/`WebUi` — только новый `.WebUi`, как у `Cron`/`Scripts`.
- Без пагинации/фильтров (явно исключены запросом). Бандл без React/Mantine/@thinking-home/ui (внешние).

## Доказательства
- `openspec/specs/plugins/telegram-chat-list/chat-tracking/spec.md:9-11` — поля модели `TelegramChatList_Chat`.
- `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs`, `frontend/{api.ts,tasks.tsx,lang.ts}` — образец кода.
- Тестов на `.WebApi`/`.WebUi` разделы чатов и cron в `ThinkingHome.Tests` нет (`git grep TelegramChatList --
  ThinkingHome.Tests` не находит ничего, кроме плагина хранения/модели).

## Аналог и единообразие
Образец — `ThinkingHome.Plugins.Cron.WebUi` (простейший раздел-список; для чатов даже проще — read-only, без
форм/CRUD/дополнительных запросов типа `describe`).

Состав образца: `*Plugin.cs` (`[ConfigureWebUi]` → `RegisterPage(url, Bundle("name.js"))`, `Bundle()` строит
`StaticResource` из embedded `{name}`, `{name}.gz`, `{name}.br`); `frontend/api.ts` (valibot-схемы + функции через
`ApiClient`); `frontend/<page>.tsx` (`export default createModule(Component)`, `useAppContext()`, `useKeyset()`,
загрузка в `useEffect` с `AbortController`); `frontend/lang.ts` (`Keyset`, англ. по умолчанию); `Lang/*.resx` +
`.ru-RU.resx`; `package.json`, `tsconfig.json`, `.csproj`; `README.md`.

Отличия: read-only список всех полей `Chat`, без форм и без `describe`-подобных запросов, без пагинации/фильтров,
сортировка фиксирована сервером.

Места подключения `Cron.WebUi` вне его каталога (`git grep -l -F --untracked -- 'Cron.WebUi'`, без строк из
`openspec/specs/...` и архивных change-логов):
- `ThinkingHome.sln:59` — запись проекта решения → нужна аналогичная.
- `ThinkingHome.Console/ThinkingHome.Console.csproj:36` — `<ProjectReference>` → нужна аналогичная.
- `ThinkingHome.Console/appsettings.json:17` — элемент `assemblies` → нужна запись (TelegramChatList и .WebApi уже
  в списке, строки 13, 22).
- `README.md:11` — список плагинов репозитория → нужна строка про новый `.WebUi`.
- `.sbox/project/architecture.md`, `.sbox/project/conventions.md` — карта проекта, не входит в объём researcher.

## Ограничения и паттерны
- URL: HTTP — `/api/{alias}/…`; раздел — короткий путь (`/cron`, `/scripts`); точное имя для чатов не выбрано.
- Клиентские данные валидируются valibot; локализация — `Keyset` + `.resx`.
- Регистрация в `.sln`, `.csproj` (`ProjectReference`), `appsettings.json` (`assemblies`) не проверяется
  компиляцией — проявляется только при запуске.

## Поверхности изменения и проверки
- Новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` по структуре `Cron.WebUi`.
- Правка `TelegramChatListWebApiPlugin.cs` — `OrderByDescending` по `date`.
- Дельта в `openspec/specs/plugins/telegram-chat-list/http-api/spec.md` про порядок сортировки.
- Новый файл спецификации по образцу `openspec/specs/plugins/cron/web-ui/spec.md`.
- Правка `Application.tsx` — пункт в `Home`-списке со ссылкой на новый раздел.
- Регистрация: `ThinkingHome.sln`, `ThinkingHome.Console.csproj`, `appsettings.json` (`assemblies`), `README.md`.
- Проверка: `dotnet build` дважды (порядок `EmbeddedResource`/`th-build`, см. `.sbox/project/architecture.md`);
  автотестов для аналогичных разделов в проекте нет — паттерн проекта, ручная проверка.

## Допущения и пробелы
- URL раздела и заголовки колонок таблицы не зафиксированы — решение planner/design, не меняет контракт данных.
- `Resources/app/*` у чатов — build-артефакт без исходников, не доказательство, будет пересоздан `th-build`.
