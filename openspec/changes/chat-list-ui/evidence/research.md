# Evidence Pack — chat-list-ui

## Цель и критерий готовности

Нормализованная формулировка (`openspec/changes/chat-list-ui/request.md`): добавить в систему отдельный плагин веб-интерфейса для плагина TelegramChatList — раздел со списком сохранённых чатов Telegram, в котором выводятся все поля таблицы `TelegramChatList_Chat` (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`); пагинация и фильтры не нужны; ссылка на новый раздел должна появиться на главной странице веб-интерфейса.

Критерий готовности (по сложившемуся в репозитории образцу добавления UI-плагина, коммит `69745f3` «web ui для плагина cron»):
- новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` собирается в составе решения и регистрирует раздел через `[ConfigureWebUi]`;
- раздел открывается в браузере и показывает таблицу со всеми полями ответа `/api/telegram-chat-list/web-api/list`;
- ссылка на раздел есть на корневой странице веб-интерфейса;
- плагин подключён в хосте (`ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json`), описан в `README.md` проекта и в списке плагинов корневого `README.md`.

## Текущее поведение

Проверенные факты:

1. Данные о чатах уже хранятся и отдаются по HTTP. `ThinkingHome.Plugins.TelegramChatList/TelegramChatListPlugin.cs` подписывается на `TelegramBotPlugin.OnMessageReceived` и пишет/обновляет запись `Chat` (`ThinkingHome.Plugins.TelegramChatList/Model/Chat.cs`, таблица `TelegramChatList_Chat`). Поля записи: `Id` (Guid), `Login` (string?), `ChatId` (long), `FirstName` (string?), `LastName` (string?), `Date` (DateTime).
2. `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` регистрирует динамический ресурс `/api/telegram-chat-list/web-api/list` и возвращает `HttpHandlerResult.Json` с массивом анонимных объектов `{ id, login, chatId, firstName, lastName, date }` — ровно все поля таблицы, без параметров, без пагинации. Сериализация — `JsonSerializer.Serialize` без настроек (`ThinkingHome.Core.Plugins/Utils/Extensions.cs:29`), поэтому `date` приходит строкой ISO-8601, `chatId` — числом, отсутствующие значения — `null` (пример ответа в `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md`).
3. Веб-интерфейса у этого плагина нет: в репозитории есть только `ThinkingHome.Plugins.TelegramChatList` и `ThinkingHome.Plugins.TelegramChatList.WebApi` (`ThinkingHome.sln:53,55`), каталога `*.WebUi` для него нет.
4. Раздел веб-интерфейса регистрируется методом с `[ConfigureWebUi]` через `WebUiConfigurationBuilder.RegisterPage(url, StaticResource)` (`ThinkingHome.Plugins.WebUi/WebUiConfigurationBuilder.cs`). Образец минимального UI-плагина — `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs`: константа префикса ресурсов `ThinkingHome.Plugins.Cron.WebUi.Resources.app.`, хелпер `Bundle(name)`, собирающий `StaticResource` из бандла и предсжатых копий `.gz`/`.br`, и один вызов `config.RegisterPage("/cron", Bundle("tasks.js"))`.
5. `WebUiPlugin` (`ThinkingHome.Plugins.WebUi/WebUiPlugin.cs`) на этапе `[ConfigureWebServer]` собирает разделы всех плагинов (`RegisterPages`), регистрирует по каждому URL раздела тот же HTML-документ, отдаёт JS-бандл по адресу `/static/webui/js/{hash(url)}.js` (`ThinkingHome.Plugins.WebUi/WebUiPageDefinition.cs`), публикует `/api/webui/meta` (список разделов + конфиг шины) и `/api/webui/lang` (строки `IStringLocalizer` плагина по `langId = hash(имя типа плагина)`).
6. Клиентская оболочка (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`) содержит маршрут `/` с компонентом `Home` (строки 25–47), в котором список ссылок задан статически в коде: `/scripts`, `/cron`, `/page1`, `/page2`, `/page3`. Тексты `Home` не локализованы (английский прямо в JSX). Остальные маршруты обслуживает `Content`, подставляющий раздел из `/api/webui/meta`. То есть «главная» — это именно `Home` в `Application.tsx`, ссылки на разделы туда добавляются вручную; так был добавлен и `/cron` (коммит `69745f3` изменил `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, +3 строки).
7. Страница-список данных на клиенте строится по общему образцу: схема valibot + функции запроса в `frontend/api.ts`, тексты в `frontend/lang.ts` через `new Keyset('en', {...})`, компонент с `useKeyset`, `useAppContext()` (`api`, `toaster`), `useLogger`, загрузка в `useEffect` с `AbortController`, рендер Mantine `Table`, экспорт `export default createModule(Component)` (`ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx`, `ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx`).
8. Сборка клиентской части UI-плагина: `package.json` с `thPlugin.entries` (имя бандла → файл точки входа) и скриптами `th-build --mode development --outDir Resources/app` / `th-build --outDir Resources/app`; в `.csproj` — таргеты `NpmInstall`, `BuildClientDevelopment`, `BuildClientProduction` и `EmbeddedResource Include="Resources\**\*"` (`ThinkingHome.Plugins.Cron.WebUi/package.json`, `ThinkingHome.Plugins.Cron.WebUi/ThinkingHome.Plugins.Cron.WebUi.csproj`, `ThinkingHome.Plugins.Cron.WebUi/tsconfig.json`).
9. Локализация раздела: файлы `Lang/{PluginClass}.resx` и `Lang/{PluginClass}.ru-RU.resx`, ключи совпадают с ключами `Keyset` (`ThinkingHome.Plugins.Cron.WebUi/Lang/CronWebUiPlugin.resx`, `…ru-RU.resx` — например, `title` → «Расписание»).
10. Подключение плагина к хосту: строка в `assemblies` файла `ThinkingHome.Console/appsettings.json` (сейчас перечислены 18 сборок, `ThinkingHome.Plugins.TelegramChatList.WebApi` — последняя), `ProjectReference` в `ThinkingHome.Console/ThinkingHome.Console.csproj:20-39` и запись проекта в `ThinkingHome.sln`.
11. Тестов, покрывающих текущее поведение chat list или веб-интерфейс, нет: `ThinkingHome.Tests` содержит только области `Core.Plugins`, `Plugins.Scripts`, `Plugins.TelegramBot`; тест-проект ссылается лишь на `ThinkingHome.Core.Plugins`, `ThinkingHome.Plugins.Scripts`, `ThinkingHome.Plugins.TelegramBot` (`ThinkingHome.Tests/ThinkingHome.Tests.csproj`, `.cow/project/testing.md`). Тест-раннера для `frontend/**` нет (`.cow/project/testing.md`, строка про unit/component TypeScript).

## Затронутые capability

Проверено через `cow spec list --json` и `cow spec show <id> --json`.

| Capability | Отношение к изменению |
|---|---|
| `plugins/telegram-chat-list/http-api` | источник данных для раздела. Требование «Список сохранённых чатов» фиксирует ресурс `/api/telegram-chat-list/web-api/list` и поля `id`, `login`, `chatId`, `firstName`, `lastName`, `date`. Изменять не требуется; раздел на него опирается (аналогично требованию «Зависимость от HTTP API расписания» в `plugins/cron/web-ui`). |
| `plugins/telegram-chat-list/chat-tracking` | определяет состав полей таблицы `TelegramChatList_Chat`. Не меняется. |
| новая capability `plugins/telegram-chat-list/web-ui` (кандидат) | поведения раздела списка чатов сейчас не описано ни одной capability; ближайший образец формулировок — `openspec/specs/plugins/cron/web-ui/spec.md` (требования «Зависимость от HTTP API расписания» и «Раздел расписания»). |
| `plugins/web-ui/page-registration` | механизм, которым раздел регистрируется (`[ConfigureWebUi]` → `RegisterPage`), и откуда клиент узнаёт про раздел (`/api/webui/meta`, `/api/webui/lang`). Механизм используется как есть, требования не меняются. |
| `plugins/web-ui/application-shell` | оболочка, которая грузит бандл раздела по маршруту. Единственное требование про корневую страницу — «Навигация оболочки» (переход на корневую страницу из навигации). Содержимое корневой страницы (список ссылок на разделы) **ни одним требованием не описано** — проверено `grep` по `openspec/specs` (совпадения только в `plugins/web-ui/application-shell/spec.md:54-58` и `plugins/web-ui/page-registration/spec.md:17-20`). Требование про ссылку на главной придётся либо добавлять сюда, либо оставить вне спецификаций — решение за планированием. |
| `plugins/web-server/url-validation` | правила URL. Alias нового плагина по правилу вычисления — `telegram-chat-list/web-ui`; проверке подлежат динамические и статические ресурсы, URL раздела регистрируется самим `WebUiPlugin` (см. «Допущения и пробелы»). |

## Границы и владение

- Новый проект должен называться `ThinkingHome.Plugins.TelegramChatList.WebUi` с классом `TelegramChatListWebUiPlugin` (`.cow/project/conventions.md`, раздел «Именование»: UI — `{Name}.WebUi`).
- UI-плагин ссылается только на `ThinkingHome.Core.Plugins`, `ThinkingHome.Plugins.WebServer`, `ThinkingHome.Plugins.WebUi` — как `ThinkingHome.Plugins.Cron.WebUi.csproj`; на доменный плагин и на `.WebApi` ссылок нет, данные берутся HTTP-запросом (`.cow/project/architecture.md`, «Границы модулей»).
- Нельзя менять: контракт `/api/telegram-chat-list/web-api/list` и код `ThinkingHome.Plugins.TelegramChatList*` (capability `http-api` и `chat-tracking` остаются как есть), инфраструктуру `WebUiPlugin`/`WebUiConfigurationBuilder`, истину спецификаций вне каталога изменения.
- Единственная точка вне нового проекта, где живёт «главная страница», — `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (компонент `Home`). Это инфраструктурный плагин: правка добавляет в него знание о прикладном разделе (прецедент уже есть — ссылки на `/scripts`, `/cron`, `/page1…3`).
- Изменение затрагивает файлы хоста: `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json`.

## Доказательства

| Факт | Путь / символ |
|---|---|
| Поля записи о чате | `ThinkingHome.Plugins.TelegramChatList/Model/Chat.cs` (`Chat.Id/Login/ChatId/FirstName/LastName/Date`) |
| Таблица и подписка на сообщения | `ThinkingHome.Plugins.TelegramChatList/TelegramChatListPlugin.cs` (`InitModel`, `TelegramBotOnMessageReceived`) |
| Эндпоинт списка чатов | `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` (`RegisterHttpHandlers`, `GetChatList`) |
| Формат ответа | `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md` (пример JSON), `ThinkingHome.Core.Plugins/Utils/Extensions.cs:29` (`ToJson`) |
| Спецификация API | `openspec/specs/plugins/telegram-chat-list/http-api/spec.md` |
| Образец UI-плагина (C#) | `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs`, `ThinkingHome.Plugins.Cron.WebUi/ThinkingHome.Plugins.Cron.WebUi.csproj` |
| Образец UI-плагина (клиент) | `ThinkingHome.Plugins.Cron.WebUi/frontend/api.ts`, `…/frontend/lang.ts`, `…/frontend/tasks.tsx`, `ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx` |
| Сборка клиента | `ThinkingHome.Plugins.Cron.WebUi/package.json` (`thPlugin.entries`, `th-build`), `…/tsconfig.json` |
| Локализация | `ThinkingHome.Plugins.Cron.WebUi/Lang/CronWebUiPlugin.resx`, `…/Lang/CronWebUiPlugin.ru-RU.resx`; выдача строк — `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs` (`GetLang`, `RegisterPages`, `localizerId`) |
| Регистрация раздела и адрес бандла | `ThinkingHome.Plugins.WebUi/WebUiConfigurationBuilder.cs` (`RegisterPage`), `ThinkingHome.Plugins.WebUi/WebUiPageDefinition.cs` (`PathJavaScript = /static/webui/js/{hash}.js`) |
| Главная страница со ссылками | `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:25-47` (компонент `Home`), маршрут `/` — строка 114 |
| Прецедент полного набора правок | `git show --stat 69745f3` (проект Cron.WebUi + `Application.tsx` + `ThinkingHome.sln` + `ThinkingHome.Console.csproj` + `appsettings.json`) |
| Подключение плагинов в хосте | `ThinkingHome.Console/appsettings.json` (ключ `assemblies`), `ThinkingHome.Console/ThinkingHome.Console.csproj:20-39` |
| Список плагинов в документации | `README.md:9-26` (строки про `Cron.WebUi`, `TelegramChatList`, `TelegramChatList.WebApi`) |
| Отсутствие тестов | `ThinkingHome.Tests/` (каталоги `Core.Plugins`, `Plugins.Scripts`, `Plugins.TelegramBot`), `ThinkingHome.Tests/ThinkingHome.Tests.csproj`, `.cow/project/testing.md` |

## Ограничения и паттерны

- Клиентский код: TypeScript 7, React 19, JSX через `React.createElement` (`"jsx": "react"`), тексты UI по умолчанию английские в `Keyset('en', …)`, переводы в `Lang/*.resx`; ответы сервера валидируются схемами valibot через `api.get(schema, {url})` (`.cow/project/conventions.md`, разделы «Язык» и «Стиль»).
- Комментарии в коде — на русском и объясняют «почему»; README плагина и спецификации — на русском (`.cow/project/conventions.md`).
- Запрещено бандлить React, react-router, Mantine, `@thinking-home/ui` в раздел — они внешние и приходят из vendor-модулей через import map; запрещено грузить шрифты/библиотеки из интернета (`.cow/project/conventions.md`, «Запрещено»).
- URL строго по схеме `/api/{alias}/…`, `/dynamic/{alias}/….ext`, `/static/{alias}/…`, `/vendor/…`; проверка — `/dynamic/web-server/url-validation/errors.txt` (`.cow/project/conventions.md`, `openspec/specs/plugins/web-server/url-validation/spec.md`).
- Раздел UI именуется `/{plugin}` или `/{plugin}/{page}`; имя бандла — ключ `thPlugin.entries` (`.cow/project/conventions.md`, «Именование»).
- `Resources/app/**` не коммитится (`.gitignore`); при чистой сборке `dotnet build ThinkingHome.sln` нужно выполнять дважды — `EmbeddedResource Include="Resources\**\*"` вычисляется до запуска `th-build` (`.cow/project/architecture.md`, раздел «Генерируемый код»).
- Изменение `Application.tsx` требует пересборки бандла оболочки WebUi (vite, `ThinkingHome.Plugins.WebUi/package.json`), а не только нового UI-проекта.
- Агенты не коммитят сами; коммит-сообщение — одна строка на русском со строчной буквы (`.cow/project/conventions.md`, «Коммиты»).

## Поверхности изменения и проверки

Вероятные поверхности правки (без выбора дизайна):

1. Новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi/`: `TelegramChatListWebUiPlugin.cs`, `.csproj`, `package.json`, `package-lock.json`, `tsconfig.json`, `frontend/*` (точка входа + `api.ts` + `lang.ts`), `Lang/TelegramChatListWebUiPlugin.resx` и `…ru-RU.resx`, `README.md`.
2. `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — ссылка на новый раздел в компоненте `Home`.
3. Хост и документация: `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json` (`assemblies`), `README.md` (список плагинов).
4. Артефакты изменения: дельта спецификаций в `openspec/changes/chat-list-ui/specs/` (новая capability раздела и, если решат фиксировать ссылку на главной, дельта для `plugins/web-ui/application-shell`).

Чем проверять (автотестов для этой области нет):
- `dotnet build ThinkingHome.sln` (при чистой сборке — дважды);
- `npx tsc -p tsconfig.json` в каталоге нового UI-проекта;
- `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — регрессия существующих 39 тестов;
- ручная проверка в браузере: запуск `ThinkingHome.Console` с PostgreSQL, открыть `/`, перейти по новой ссылке, увидеть таблицу чатов; проверить `/dynamic/web-server/url-validation/errors.txt` на отсутствие новых ошибок (`.cow/project/testing.md`).

## Допущения и пробелы

Допущения (следуют из соглашений, но выбор — за планированием/дизайном):
- URL раздела `/telegram-chat-list` — по правилу «Разделы UI: `/{plugin}`» из `.cow/project/conventions.md`; в коде это значение нигде не зафиксировано.
- Имя бандла и точки входа (например, `chats` → `frontend/chats.tsx`) не предопределено ничем, кроме ключа `thPlugin.entries`.
- Локализация раздела предполагается по образцу Cron.WebUi (`Keyset('en')` + два `.resx`); запрос этого явно не требует.

Пробелы (не закрываются кодом, но объём/контракт не меняют — решаются на планировании, не блокируют исследование):
- Содержимое корневой страницы не описано ни одной capability, поэтому неясно, фиксировать ли требование «ссылка на раздел на главной» в спецификациях и в какой capability (`plugins/web-ui/application-shell` — единственная, где есть требование про корневую страницу).
- Компонент `Home` не локализован и перечисляет разделы статически; альтернатива «строить список ссылок из `/api/webui/meta`» технически доступна (метаданные содержат все зарегистрированные разделы), но это расширение объёма — в запросе его нет.
- Формат отображения полей (`id` как Guid, `chatId` как число, `date` как дата/время, `null` для отсутствующих значений) в запросе не оговорён; данные приходят как в примере `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md`.
- Не проверено (нет способа проверить чтением кода): проходит ли URL раздела вида `/telegram-chat-list` проверку `UrlValidationPlugin` — документ раздела регистрирует `WebUiPlugin` как динамический ресурс без расширения и без префикса `/api/{alias}/`, в коде рядом стоит комментарий `// TODO: подумать про пути к корневой странице + валидацию путей` (`ThinkingHome.Plugins.WebUi/WebUiPlugin.cs`). Для уже существующих разделов (`/cron`, `/scripts`) ситуация та же, то есть поведение не новое; фактический список ошибок виден только при запуске приложения.
