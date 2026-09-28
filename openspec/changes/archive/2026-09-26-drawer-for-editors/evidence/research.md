# Evidence Pack — drawer-for-editors

## Разбор запроса

| Утверждение | Статус | Доказательство |
|---|---|---|
| «сейчас в веб-интерфейсе есть несколько форм: создание подписки, редактирование расписания cron и т.д.» | подтверждено | `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` (форма добавления подписки, стр. 160–237); `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx` (форма добавления/редактирования задачи, стр. 147–184). Других инлайн-форм в проекте нет: `grep -rl "formVisible" --include=*.tsx` даёт только эти два файла. |
| «они отрисовываются прямо на странице списка» | подтверждено | В обоих файлах форма — часть того же компонента страницы (`<Stack>` внутри `CronTaskList`/`SubscriptionList`), переключается локальным state `formVisible`, отдельного роута/оверлея нет. |
| «нужно перенести эти формы в шторку» | не проверено (целевое состояние, код ещё не создан) | — |
| «нужно использовать шторку из mantine» | подтверждено (компонент существует) | `@mantine/core` в обоих `package.json` (`ThinkingHome.Plugins.Cron.WebUi/package.json`, `ThinkingHome.Plugins.Scripts.WebUi/package.json`) содержит `Drawer`; сейчас `Drawer` нигде не импортируется (`grep -rn "Drawer" --include=*.tsx` — 0 совпадений вне node_modules). |
| «для этого нужно обновить th-ui» | подтверждено частично | Во всех 5 `package.json` плагинов зависимость `"@thinking-home/ui": "^0.11.0"`, и в `package-lock.json` зафиксирована `0.11.0`. Но в `node_modules` фактически стоит `0.13.0` (`ThinkingHome.Plugins.Scripts.WebUi/node_modules/@thinking-home/ui/package.json` → `"version": "0.13.0"`) — рассинхрон lock-файла и установленного пакета. Последняя опубликованная версия в реестре npm — `0.13.0` (`npm view @thinking-home/ui versions`). Не удалось подтвердить из CHANGELOG самого пакета (`npm view` завис/недоступен из песочницы), что именно 0.13.0 чинит порталы Drawer/Modal — это только заметка хоста, кодом не подтверждена. |
| «также поправь баг: динамические ресурсы кэшируются на сервере по пути, без учета query параметров» | подтверждено | `ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs:43`: `var cacheKey = $"...:{path}:{acceptEncoding}"` — `path` берётся из `context.Request.Path.Value` (без `QueryString`). |
| «из-за этого для всех страниц отдаются одинаковые переводы от первой запрошенной страницы» | подтверждено | `/api/webui/lang` зарегистрирован с `isCached: true` (`ThinkingHome.Plugins.WebUi/WebUiPlugin.cs:74`); обработчик `GetLang` (строка 164–178) читает обязательный параметр `id` из query (`requestParams.GetRequiredString("id")`) и возвращает разные словари для разных `id`, но кэш-ключ не учитывает query — первый вызов с любым `id` кладёт результат в кэш на 2 часа (`CACHE_EXPIRATION = 7200`) под ключом, общим для всех `id`. |

## Текущее поведение

- Форма cron: `tasks.tsx` — `formVisible`/`editingId` в state компонента `CronTaskList`, поля рендерятся в `<Stack maw={480}>` над таблицей задач; кнопки `save/add` и `cancel` вызывают `submit`/`resetForm`.
- Форма подписки: `subscriptions.tsx` — аналогичный паттерн в `SubscriptionList`, но с полями `Select` (скрипт, событие) и динамической таблицей мета-фильтра.
- Обе страницы зарегистрированы как разделы через `RegisterPage`: `/cron` → `tasks.js` (`CronWebUiPlugin.cs:20`), `/scripts` → `list.js`, `/scripts/edit` → `editor.js`, `/scripts/subscriptions` → `subscriptions.js` (`ScriptsWebUiPlugin.cs:31-33`). Регистрация только внутри своего плагина, внешних мест подключения нет.
- Кэш динамических ресурсов: `HomePluginsMiddleware.Invoke` (`ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs:27-85`) — при `handler.IsCached` кэширует по ключу `{path}:{acceptEncoding}` на 7200 с через `IMemoryCache`; без кэша отдаёт `Cache-Control: no-cache, no-store`.
- Единственный кэшируемый динамический ресурс с обязательным query-параметром — `/api/webui/lang?id=<localizerId>` (`WebUiPlugin.cs:74`, `GetLang` строки 164-178). Другие `isCached: true` ресурсы (`/`, страницы `pageDef.PathDocument`) query не используют.

## Затронутые capability

- `plugins/web-ui/application-shell` — оболочка веб-интерфейса, `/api/webui/lang`, vendor-модули th-ui/Mantine (`openspec/specs/plugins/web-ui/application-shell/spec.md`); текущий текст спеки не описывает кэширование по query — противоречия со спецификацией нет.
- `plugins/web-server/http-resources` — контракт динамических ресурсов и кэширования (`openspec/specs/plugins/web-server/http-resources/spec.md:57`: «Динамический ресурс SHALL опционально кэшироваться… некэшируемый ответ SHALL сопровождаться заголовком, запрещающим кэширование»); про учёт query в ключе кэша спека не говорит — это дефект реализации, а не расхождение со спецификацией.
- `plugins/cron/web-ui` и `plugins/scripts/web-ui` — разделы `/cron`, `/scripts/subscriptions` содержат формы, подлежащие переносу в шторку.

## Границы и владение

- Инфраструктурные плагины (`WebServer`, `WebUi`) не ссылаются на прикладные (`Cron`, `Scripts`) — правило архитектуры (`.sbox/project/architecture.md`, раздел «Границы модулей»); фикс кэша делается только в `ThinkingHome.Plugins.WebServer`.
- Клиентские бандлы разделов не включают React, Mantine, `@thinking-home/ui` — они внешние (`SHARED_EXTERNALS`, `ThinkingHome.Plugins.WebUi/vite.config.mts:60`) и приходят из vendor-модулей хоста; апгрейд `@thinking-home/ui` меняет и хостовый vendor-бандл (`ThinkingHome.Plugins.WebUi`), и `package.json`/lock всех 5 плагинов, использующих пакет.
- HTTP API форм (`ScriptsWebApiPlugin.cs`, `CronWebApiPlugin.cs`) не входит в объём — запрос про перенос формы в шторку и про кэш, не про API.

## Доказательства

- `ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs:43` — некорректный ключ кэша.
- `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs:74,164-178` — `/api/webui/lang` с `isCached:true` и обязательным `id`.
- `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx:22-24,147-184` — инлайн-форма cron.
- `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:34-42,160-237` — инлайн-форма подписки.
- `*/package.json` (5 файлов) и `*/package-lock.json` — версия `@thinking-home/ui` `^0.11.0` в манифестах / `0.11.0` в lock, но `0.13.0` фактически установлена в `node_modules`.
- `ThinkingHome.Plugins.WebUi/vite.config.mts` — механизм копирования vendor-модулей th-ui в `Resources/app/vendor`.

## Аналог и единообразие

- Образец — `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx`: самая простая из двух форм (только текстовые поля и переключатель), паттерн `formVisible`/`editingId`/`resetForm`/`startEdit`/`submit` с обработкой ошибок через `fail()` и `toaster`.
- `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` — тот же паттерн state-машины формы, но добавляет `Select` и динамическую таблицу мета-фильтра; расхождение оправдано разным набором полей, менять на форму без таблицы не нужно.
- Места подключения обоих файлов — только внутри своего плагина (`CronWebUiPlugin.cs:20`, `ScriptsWebUiPlugin.cs:31-33`); внешних файлов, где встречаются `tasks.tsx`/`subscriptions.tsx`, нет (`git grep` не находит упоминаний имени модуля вне каталога).
- Общая точка единообразия обеих форм — импорт `createModule, useAppContext, useKeyset, useLogger` из `@thinking-home/ui` и компоненты `@mantine/core`; `Drawer` в проекте пока нигде не используется, готового образца открытия шторки в кодовой базе нет.

## Ограничения и паттерны

- Правило: «Собирать дважды» — `EmbeddedResource` вычисляется до `th-build`/`vite build`, при чистой сборке нужен повторный `dotnet build` (`.sbox/project/architecture.md`, раздел «Генерируемый код»).
- Правило хоста (память): th-ui вендорится через shared React-инстанс (`SHARED_EXTERNALS`); апгрейд пакета требует пересборки vendor-бандла `ThinkingHome.Plugins.WebUi`, иначе модальные порталы могут ломаться — заметка хоста, не подтверждена содержимым CHANGELOG пакета (сеть не ответила вовремя).
- Порт 8080 может быть занят, локальный запуск — через `THINKINGHOME_...` порт 8090 и Postgres в podman (память хоста «Local run environment») — актуально для последующей ручной/браузерной проверки шторки.

## Поверхности изменения и проверки

- `ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs` — ключ кэша должен включать query string; проверка — юнит/интеграционный тест на `/api/webui/lang?id=A` и `?id=B` отдают разные тела, плюс существующие тесты `ThinkingHome.Tests` (не читаны, вероятный каталог для новых тестов).
- `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx`, `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` — заменить инлайн-форму на `Drawer` из `@mantine/core`; проверка — `sbox-browser`: открыть `/cron` и `/scripts/subscriptions`, кликнуть «новая задача»/«новая подписка», убедиться что форма в шторке, а не на странице.
- `package.json`/`package-lock.json` пяти UI-плагинов и `ThinkingHome.Plugins.WebUi` (vendor) — обновление `@thinking-home/ui` до версии, реально поддерживающей Drawer/Modal.

## Допущения и пробелы

- Не подтверждено кодом/чейнджлогом, что именно версия `0.13.0` th-ui чинит проблему с порталами Drawer/Modal — источник только память хоста; при планировании стоит перепроверить через `npm view @thinking-home/ui@0.13.0` (не ответил в песочнице) или тестовый прогон шторки после апгрейда.
- Не проверено в браузере, как страницы `/cron` и `/scripts/subscriptions` выглядят сейчас (сессия `sbox-browser` не поднималась — задача носит объём «дизайн + факты», приложение не запущено в этом прогоне; при необходимости живого снимка — поднять `sbox-browser goto http://localhost:8090/cron` после локального запуска, см. память «Local run environment»).
- «и т.д.» в запросе не соответствует третьей реально найденной инлайн-форме — в кодовой базе есть ровно две (cron, подписка); зафиксировано как факт, доменное решение (охватывает ли задача другие формы) не мой уровень.
