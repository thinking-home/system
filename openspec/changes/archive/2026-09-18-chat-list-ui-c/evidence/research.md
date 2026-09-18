# Evidence Pack — chat-list-ui-c

## Цель и критерий готовности

Добавить отдельный плагин веб-интерфейса для `TelegramChatList`: страница со списком всех сохранённых чатов, отображающая все поля таблицы (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`), без пагинации и фильтров. На главной странице веб-интерфейса — ссылка на новый раздел. (`openspec/changes/chat-list-ui-c/request.md`)

## Текущее поведение

- HTTP API уже существует и отдаёт все нужные поля: `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` — `GET /api/telegram-chat-list/web-api/list` возвращает `{id, login, chatId, firstName, lastName, date}` без пагинации/фильтров.
- Раздела веб-интерфейса для чатов нет. Плагин `ThinkingHome.Plugins.TelegramChatList.WebUi` не существует ни в файловой системе, ни в `ThinkingHome.sln`, ни в `ThinkingHome.Console/appsettings.json:assemblies`.
- Главная страница веб-интерфейса — хардкод в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (`const Home`, строки 25-47): список `<Anchor component={Link} to="...">` на разделы `/scripts`, `/cron`, `/page1..3`. Ссылка на новый раздел добавляется здесь же новым `List.Item`.

## Затронутые capability

- `plugins/telegram-chat-list/http-api` — уже покрывает нужный контракт данных (`openspec/specs/plugins/telegram-chat-list/http-api/spec.md`), менять не требуется.
- Новая capability не существует в specsTruth: `plugins/telegram-chat-list/web-ui` — потребуется новый спецификационный файл-дельта (аналог `plugins/cron/web-ui`, `openspec/specs/plugins/cron/web-ui/spec.md`), описывающий раздел списка чатов без пагинации/фильтров.
- `plugins/web-ui/page-registration` и `plugins/web-ui/application-shell` — задают контракт регистрации раздела и общей оболочки; новый раздел должен соответствовать им, изменений в этих спецификациях не требуется.

## Границы и владение

- Инфраструктурные плагины (`WebServer`, `WebUi`, `Database`, `Timer`, `Scripts`) не ссылаются на прикладные — новый проект `TelegramChatList.WebUi` должен зависеть от `WebServer`+`WebUi` (как `Cron.WebUi`), а не наоборот.
- Доменный плагин не ссылается на `WebServer`/`WebUi` — эта логика уже разнесена: `TelegramChatList` (хранение) / `TelegramChatList.WebApi` (HTTP) / новый `TelegramChatList.WebUi` (раздел UI).
- Раздел не создаёт свой API-клиент/соединение с шиной — использует `useAppContext()` из `@thinking-home/ui` (см. `plugins/web-ui/application-shell` Requirement «Общий контекст выполнения раздела»).
- Правку хардкод-списка ссылок на главной (`Application.tsx`) допустимо делать точечно — там уже перечислены ссылки на `Scripts` и `Cron`.

## Доказательства

- `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` — эндпоинт списка, поля ответа.
- `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs` — регистрация раздела через `[ConfigureWebUi]`, `WebUiConfigurationBuilder.RegisterPage(url, Bundle(...))`.
- `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx` — паттерн страницы-списка: `useAppContext()`, `useKeyset(keyset)`, загрузка через `useEffect`+`AbortController`, `Mantine Table`.
- `ThinkingHome.Plugins.Cron.WebUi/frontend/api.ts` — паттерн API-клиента: valibot-схема ответа, `api.get(schema, {url, signal})`.
- `ThinkingHome.Plugins.Cron.WebUi/frontend/lang.ts` + `Lang/CronWebUiPlugin*.resx` — паттерн локализации (en по умолчанию в keyset, переводы в resx).
- `ThinkingHome.Plugins.Cron.WebUi/ThinkingHome.Plugins.Cron.WebUi.csproj` — шаблон csproj (NpmInstall/BuildClientDevelopment/BuildClientProduction targets, EmbeddedResource, ProjectReference на Core.Plugins/WebServer/WebUi).
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:25-47` — хардкод главной страницы со списком ссылок на разделы.
- `ThinkingHome.Console/appsettings.json:4-23` (`assemblies`) — список загружаемых сборок; `TelegramChatList.WebApi` там уже есть, `TelegramChatList.WebUi` нужно добавить.
- `ThinkingHome.sln:53-59` — существующие записи проектов `TelegramChatList`, `TelegramChatList.WebApi`, `Cron.WebUi`; новый проект нужно зарегистрировать так же.
- `openspec/specs/plugins/cron/web-ui/spec.md` — образец формата spec-файла для раздела UI.
- `.cow/project/architecture.md` — карта пакетов, границы, генерируемый код (`Resources/app/**`, двойная сборка после чистого клонирования).

## Аналог и единообразие

Ближайший и полностью применимый аналог — `ThinkingHome.Plugins.Cron.WebUi` (список + CRUD). Для данной задачи (только список, без действий) релевантна именно read-only часть его структуры:
- csproj с теми же MSBuild-таргетами и зависимостями (Core.Plugins, WebServer, WebUi);
- `CronWebUiPlugin.cs` → `[ConfigureWebUi] RegisterWebUiPages` регистрирует один URL (`/telegram-chat-list` или подобный) с бандлом;
- `frontend/<name>.tsx` — компонент через `createModule(...)`, `useAppContext()` за API-клиентом, `Mantine Table` с колонками по всем полям, `useKeyset` для текстов;
- `frontend/api.ts` — valibot-схема, `api.get(schema, {url: '/api/telegram-chat-list/web-api/list', signal})`;
- `frontend/lang.ts` + `Lang/*.resx` — локализация заголовков колонок и текста пустого списка;
- регистрация в `ThinkingHome.sln` и `ThinkingHome.Console/appsettings.json:assemblies`;
- ссылка на главной — новый `List.Item`/`Anchor` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`.

Отличие от Cron.WebUi: нет формы добавления/редактирования/удаления, нет debounce-запросов к серверу — только загрузка и таблица (по аналогии с частью `list` в `tasks.tsx`, без блока формы/actions).

## Ограничения и паттерны

- URL-схема ресурсов: `/api/{alias}/…`, статический раздел — по правилам `plugins/web-server/url-validation` (не проверял отдельно, т.к. схема соблюдена уже в `Cron.WebUi`/`TelegramChatList.WebApi` — образец).
- Раздел не хранит серверную логику форматирования дат/имён — сервер уже отдаёт сырые поля; форматирование (если нужно) на клиенте.
- Генерируемый код `Resources/app/**` не редактируется руками; сборка требует двойного `dotnet build` при первом клонировании (см. `.cow/project/architecture.md`, раздел «Генерируемый код»).
- Спецификации — источник истины о поведении; для нового раздела потребуется добавить дельту capability `plugins/telegram-chat-list/web-ui` в `openspec/specs/...` (её сейчас нет в specsTruth).

## Поверхности изменения и проверки

- Новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi/*` (csproj, `TelegramChatListWebUiPlugin.cs`, `frontend/*.tsx`, `frontend/api.ts`, `frontend/lang.ts`, `Lang/*.resx`, `package.json`, `tsconfig.json`).
- `ThinkingHome.sln` — добавить Project-запись нового проекта.
- `ThinkingHome.Console/appsettings.json` — добавить сборку в `assemblies`.
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — добавить пункт списка на главной.
- Новый spec-файл (дельта) для capability `plugins/telegram-chat-list/web-ui` по образцу `openspec/specs/plugins/cron/web-ui/spec.md`.
- Проверка: `dotnet build ThinkingHome.sln` (дважды при первой сборке), открытие `/telegram-chat-list` (или выбранного URL) в UI, `cow validate`.

## Допущения и пробелы

- Точный URL и текст заголовка раздела (например `/telegram-chat-list` и подпись в навигации/на главной) не зафиксированы в request.md — не блокирует исследование, решается на этапе планирования по аналогии с `/cron`.
- Нет отдельного теста на `TelegramChatListWebApiPlugin` в `ThinkingHome.Tests` (не искал целенаправленно — не на критическом пути новой фичи, т.к. API уже готово и не меняется).
- Не проверялся `openspec/specs/plugins/web-server/url-validation/spec.md` построчно — вывод о соответствии схемы URL сделан по аналогии с уже принятыми путями `Cron.WebUi`/`TelegramChatList.WebApi`.
