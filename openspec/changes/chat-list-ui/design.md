## Общая картина

Появляется новый UI-плагин `ThinkingHome.Plugins.TelegramChatList.WebUi` — раздел веб-интерфейса, который читает список сохранённых чатов через существующий HTTP API и показывает его таблицей. Порядок вывода задаёт сервер: в `TelegramChatListWebApiPlugin` выборка чатов упорядочивается по убыванию даты (решение владельца на гейте tests, D3), раздел выводит записи в полученном порядке. Доменный плагин `TelegramChatList` и модель хранения не меняются.

Путь пользователя:

1. Пользователь открывает корневую страницу веб-интерфейса `/`. Оболочка (`ThinkingHome.Plugins.WebUi`, компонент `Home` в `frontend/components/Application.tsx`) показывает список ссылок на разделы; в него добавляется ссылка на список чатов.
2. Пользователь переходит по ссылке на `/telegram-chat-list`. Оболочка находит этот маршрут среди разделов из `/api/webui/meta`, подгружает ESM-бандл раздела и его языковой пакет (`/api/webui/lang?id={langId}`) — механизм `plugins/web-ui/page-registration` и `plugins/web-ui/application-shell` используется как есть.
3. Компонент раздела при монтировании запрашивает `GET /api/telegram-chat-list/web-api/list` через `api` из `useAppContext()`, валидирует ответ схемой valibot и рендерит таблицу Mantine со всеми полями записи в том порядке, в котором записи пришли от API (сервер отдаёт их по убыванию `date`).
4. Состояния раздела: данные ещё не получены — раздел ничего не рисует (как `Cron.WebUi`); список пуст — заголовок раздела и вместо таблицы сообщение «чатов пока нет»; ошибка запроса — запись в лог (`useLogger`) и уведомление `toaster.showError`, таблица не отображается.

Что меняется в компонентах:

| Компонент | Что меняется |
|---|---|
| Новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` | весь код раздела: класс плагина с `[ConfigureWebUi]`, клиентский бандл, ресурсы локализации, README |
| `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs` | в `GetChatList` выборка упорядочивается по убыванию `Chat.Date` (D3); README плагина дополняется описанием порядка ответа |
| `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` | одна ссылка на `/telegram-chat-list` в компоненте `Home` (требует пересборки бандла оболочки) |
| `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json` | подключение нового проекта к решению и хосту |
| `README.md` (корневой) | строка о новом плагине в списке плагинов |
| `ThinkingHome.Plugins.TelegramChatList` (доменный плагин, модель `Chat`, миграции) | не меняется |

Схема потока данных:

```
браузер
  │  GET /                         → HTML оболочки (WebUiPlugin)
  │  GET /api/webui/meta           → список разделов, среди них /telegram-chat-list
  │  клик по ссылке «Telegram chats» в Home
  ▼
/telegram-chat-list (маршрут оболочки)
  │  GET /static/webui/js/{hash}.js         → бандл chats.js (StaticResource из DLL плагина)
  │  GET /api/webui/lang?id={langId}        → строки Lang/TelegramChatListWebUiPlugin*.resx
  ▼
компонент раздела
  │  GET /api/telegram-chat-list/web-api/list   (api из AppContext, схема valibot)
  ▼
TelegramChatListWebApiPlugin → DatabasePlugin.OpenSession() → таблица TelegramChatList_Chat
  │                                            ORDER BY Date DESC (D3)
  ▼
пусто → сообщение «чатов пока нет»
непусто → Mantine Table в порядке ответа API (без сортировки на клиенте)
```

## Единообразие

| Что делаем | Модуль-образец | Отступления и причины |
|---|---|---|
| Проект раздела целиком: `.csproj` с таргетами `th-build`, `package.json` с `thPlugin.entries`, `tsconfig.json`, класс плагина с `[ConfigureWebUi]`, `Lang/*.resx`, README | `ThinkingHome.Plugins.Cron.WebUi/**` (`CronWebUiPlugin.cs`, `ThinkingHome.Plugins.Cron.WebUi.csproj`, `package.json`, `tsconfig.json`, `Lang/CronWebUiPlugin.resx`) — research.md, факты 4, 8, 9 | отступлений нет: имена, состав файлов и способ сборки копируются, меняются только имена плагина, бандла и ресурсов |
| Клиентский раздел-список: `frontend/api.ts` (схема valibot + запрос), `frontend/lang.ts` (`Keyset('en', …)`), компонент с `useAppContext`, `useKeyset`, `useLogger`, загрузкой в `useEffect` с `AbortController`, `Table` Mantine, `export default createModule(Component)`, прочерк для пустых значений, ветка пустого списка | `ThinkingHome.Plugins.Cron.WebUi/frontend/{api.ts,lang.ts,tasks.tsx}`, `ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx` — research.md, факт 7 | отступление одно: нет действий над записями и, соответственно, кнопок, форм и модальных окон — раздел только для чтения (требование дельты). Сортировки на клиенте нет — как и в образцах: ни `Cron.WebUi`, ни `Scripts.WebUi` не переупорядочивают ответ API |
| Ссылка на раздел на корневой странице | список ссылок компонента `Home` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, прецедент `/cron` (коммит `69745f3`) — research.md, факт 6 | отступлений нет: пункт добавляется тем же способом, текст не локализован — как у соседних пунктов |
| Порядок записей в HTTP API списка | `ThinkingHome.Plugins.Cron.WebApi/CronWebApiPlugin.cs:79-83` (`GetTaskList`: `session.Set<CronTask>().OrderBy(e => e.Name).Select(ToApiModel).ToArray()`), зафиксировано требованием `openspec/specs/plugins/cron/http-api/spec.md:16-21` («список … упорядоченный по `name`») | отступлений нет: тот же приём — `OrderBy…` в выборке до проекции и клауза о порядке в требовании API. Отличается только поле и направление (`OrderByDescending(x => x.Date)`), потому что для чатов осмысленный порядок — от самых новых |
| Подключение плагина к хосту и документация | `ThinkingHome.sln`, `ThinkingHome.Console/ThinkingHome.Console.csproj`, `ThinkingHome.Console/appsettings.json`, корневой `README.md` — research.md, факты 10, прецедент `69745f3` | отступлений нет |

## Контракты

### HTTP: `GET /api/telegram-chat-list/web-api/list`

- Существующий динамический ресурс, параметров нет; состав и типы полей ответа прежние: массив объектов `{ id: string (Guid), login: string|null, chatId: number, firstName: string|null, lastName: string|null, date: string (ISO-8601) }`.
- Изменение контракта: ответ SHALL быть упорядочен по убыванию `date` (самая новая запись — первая). Параметров сортировки не появляется, порядок фиксирован.
- Реализация: в `TelegramChatListWebApiPlugin.GetChatList` выборка дополняется `OrderByDescending(x => x.Date)` до проекции — упорядочивание выполняет СУБД (`ORDER BY "Date" DESC`), не память процесса.
- Совместимость: изменение обратно совместимое — раньше порядок контрактом не задавался.

### Схема валидации ответа (клиент, valibot)

```ts
v.array(v.object({
    id: v.string(),
    login: v.nullable(v.string()),
    chatId: v.number(),
    firstName: v.nullable(v.string()),
    lastName: v.nullable(v.string()),
    date: v.string(),
}))
```

### Регистрация раздела

- Класс `TelegramChatListWebUiPlugin : PluginBase`, метод с `[ConfigureWebUi]`, вызов `config.RegisterPage("/telegram-chat-list", Bundle("chats.js"))` (обоснование адреса — D2).
- Префикс ресурсов: `ThinkingHome.Plugins.TelegramChatList.WebUi.Resources.app.`; `StaticResource` собирается из бандла и предсжатых копий `.gz` и `.br` (как в `CronWebUiPlugin`).
- Точка входа клиента: `thPlugin.entries` = `{ "chats": "frontend/chats.tsx" }`; экспорт по умолчанию — `createModule(Component)`.
- Собственных HTTP-ресурсов раздел не регистрирует: адрес документа раздела и адрес бандла (`/static/webui/js/{hash}.js`) формирует `WebUiPlugin`.

### Локализация

- `Lang/TelegramChatListWebUiPlugin.resx` (английский) и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` (русский); ключи совпадают с ключами `Keyset('en', …)` в `frontend/lang.ts`.
- Набор ключей: `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad`.
- Значения по умолчанию (английский) и перевод: `emptyList` — `There are no chats yet` / «Чатов пока нет»; `errorLoad` — `Failed to load data` / «Не удалось загрузить данные» (тексты и ключи — по образцу `Cron.WebUi`).

### Структура UI и идентификаторы для тестов

- `<Title>{t('title')}</Title>` и Mantine `Table` с колонками в порядке `id`, `login`, `chatId`, `firstName`, `lastName`, `date`; `key` строки — `id` чата.
- Состояния раздела:
  - данные не загружены (`list === undefined`) — компонент возвращает `null`;
  - список пуст (`list.length === 0`) — вместо `Table` рендерится `<Text c="dimmed">{t('emptyList')}</Text>`, заголовок раздела остаётся (D5);
  - ошибка — `toaster.showError(t('errorLoad'))`, `Table` не рендерится (D7).
- Идентификаторов для автотестов (`data-testid`) не добавляем: браузерных и компонентных тестов в проекте нет (`testing.md`), существующие разделы их не используют. Проверка раздела — сборка, `tsc` и ручной сценарий в браузере.
- Ссылка на корневой странице: элемент `<Anchor component={Link} to="/telegram-chat-list">Telegram chats</Anchor>` в списке компонента `Home` (тексты `Home` не локализованы — как у соседних ссылок).

### Поставка

- `ThinkingHome.sln`: запись проекта; `ThinkingHome.Console.csproj`: `ProjectReference`; `appsettings.json`: строка `ThinkingHome.Plugins.TelegramChatList.WebUi` в `assemblies`.
- `ThinkingHome.Plugins.TelegramChatList.WebUi/README.md` по образцу `Cron.WebUi/README.md`; строка в списке плагинов корневого `README.md`.

## Решения

### D1. Отдельный проект `.WebUi` без ссылок на доменный плагин

- Решение: новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` с `ProjectReference` только на `ThinkingHome.Core.Plugins`, `ThinkingHome.Plugins.WebServer`, `ThinkingHome.Plugins.WebUi`; данные берутся HTTP-запросом к существующему API.
- Обоснование: граница модулей из `architecture.md` («HTTP API и UI вынесены в отдельные проекты, доменный плагин не ссылается на WebServer и WebUi»); повторяет структуру `Cron.WebUi` и `Scripts.WebUi`.
- Альтернативы: (а) добавить UI в `TelegramChatList.WebApi` — смешивает API и UI, нарушает соглашение об именовании; (б) читать БД напрямую из UI-плагина — нарушает границу модулей и требование «Зависимость от HTTP API списка чатов».
- Последствия: раздел без плагина `TelegramChatList.WebApi` данных не покажет; это зафиксировано требованием и описано в README.
- promote: false

### D2. Адрес раздела `/telegram-chat-list` — проверен по правилам формирования URL

- Решение: раздел регистрируется по адресу `/telegram-chat-list`, имя бандла — `chats` (точка входа `frontend/chats.tsx`).
- Проверка правил проекта (ответ на замечание гейта):

  | Правило | Источник | Что даёт для раздела |
  |---|---|---|
  | Plugin alias: имя пакета без `ThinkingHome.Plugins.`, camelCase → дефис, точки → слэш, нижний регистр | `ThinkingHome.Plugins.WebServer.UrlValidation/README.md` («Правила формирования URL»), `openspec/specs/plugins/web-server/url-validation/spec.md`, `glossary.md` | alias доменного пакета `ThinkingHome.Plugins.TelegramChatList` = `telegram-chat-list`; alias пакета раздела `…TelegramChatList.WebUi` = `telegram-chat-list/web-ui` |
  | Адреса HTTP-ресурсов: `/api/{alias}/…` (без расширения), `/dynamic/{alias}/….ext`, `/static/{alias}/….ext`, `/vendor/…` | тот же README, `conventions.md` («Запрещено») | к разделу не применяется напрямую: раздел не регистрирует HTTP-ресурсов сам, адрес документа раздела и адрес бандла регистрирует `WebUiPlugin` (см. «Риски») |
  | Разделы UI: `/{plugin}` и `/{plugin}/{page}`, пример `/scripts/edit` для `ThinkingHome.Plugins.Scripts.WebUi/frontend/editor.tsx` | `conventions.md`, «Именование» | `{plugin}` — alias доменного пакета без суффикса `.WebUi`; у пакета с одним разделом это `/{plugin}` |
  | Фактические адреса разделов в коде | `CronWebUiPlugin.cs` (`/cron`), `ScriptsWebUiPlugin.cs` (`/scripts`, `/scripts/edit`, `/scripts/subscriptions`) | подтверждают чтение `{plugin}` = alias доменного пакета: для `Cron.WebUi` это `/cron`, а не `/cron/web-ui` |

  Итог проверки: по правилу «Разделы UI» единственный раздел пакета `TelegramChatList.WebUi` адресуется как `/telegram-chat-list`; вариант `/telegram-chat-list/chats` допустим правилом, но избыточен при одном разделе, вариант `/telegram-chat-list/web-ui` противоречит прецедентам `/cron` и `/scripts`. Расхождение осталось только в трактовке `{plugin}` — вынесено в Q1.
- Обоснование: адрес совпадает с alias плагина, к которому относятся данные (тот же `telegram-chat-list`, что и в `/api/telegram-chat-list/web-api/list`), и повторяет способ адресации всех существующих разделов.
- Альтернативы: `/telegram-chat-list/chats` — лишний уровень при единственном разделе; `/telegram-chat-list/web-ui` — буквальный alias пакета раздела, нет прецедента, читается как технический путь; `/chats` — не соответствует alias и может конфликтовать с другими плагинами.
- Последствия: адрес раздела фиксируется спецификацией и README; ссылка на корневой странице ведёт на него; в отчёте `/dynamic/web-server/url-validation/errors.txt` появятся такие же строки, как для `/cron` и `/scripts` (см. «Риски»).
- promote: false

### D3. Порядок по убыванию даты задаётся на сервере, в запросе к БД

- Решение: в `TelegramChatListWebApiPlugin.GetChatList` выборка чатов дополняется `OrderByDescending(x => x.Date)` до проекции в анонимный объект; порядок становится частью контракта `/api/telegram-chat-list/web-api/list` (дельта к `plugins/telegram-chat-list/http-api`). Раздел выводит записи в полученном порядке и не сортирует их сам.
- Обоснование: решение владельца на гейте tests («порядок вывода задаём на сервере: захардкодить сортировку по дате по убыванию в HTTP API списка чатов»). Оно же единообразно с `CronWebApiPlugin.GetTaskList` (`OrderBy(e => e.Name)`), где порядок списка тоже задан сервером и зафиксирован требованием `plugins/cron/http-api`; упорядочивает СУБД (`ORDER BY "Date" DESC`), а не память процесса; порядок одинаков для всех клиентов API и проверяется без браузера, одним запросом `curl`.
- Альтернативы: (а) сортировка на клиенте (вариант прошлой редакции дизайна) — отклонён владельцем: порядок не был бы виден другим потребителям API и проверялся бы только в браузере; (б) параметры сортировки в запросе — расширение контракта, границами изменения исключено.
- Последствия: меняется поведение существующей capability `plugins/telegram-chat-list/http-api` (обратно совместимо: поля и параметры прежние, раньше порядок не был определён); правится код `TelegramChatList.WebApi` и его README; в клиенте сортировки нет — раздел рендерит массив как пришёл; при равных значениях `date` относительный порядок таких записей не определён (СУБД его не гарантирует), что для чатов приемлемо — `date` хранит момент последнего сообщения.
- promote: false

### D4. Отображение полей: таблица со всеми полями, дата по локали, `null` — прочерком

- Решение: Mantine `Table` с шестью колонками в порядке ответа API; `id` и `chatId` выводятся как есть, `date` форматируется для показа по языку интерфейса (`lang` из `useAppContext()`), пустые `login`, `firstName`, `lastName` — прочерком «—» (приём из `Cron.WebUi`: `<Text c="dimmed">—</Text>`).
- Обоснование: запрос требует показать все поля таблицы; ISO-строка нечитаема для владельца дома, а `lang` уже есть в контексте приложения; прочерк отличает «значение не задано» от пустой ячейки.
- Альтернативы: (а) выводить `date` как есть — читается хуже, но не зависит от локали браузера (см. Q3); (б) скрывать `id` — противоречит запросу «все поля таблицы».
- Последствия: значение `date` приходит без указания часового пояса и трактуется как локальное время; смещения не применяются.
- promote: false

### D5. Состояние пустого списка: сообщение вместо таблицы

- Решение: если ответ API пуст, раздел рендерит заголовок и вместо `Table` — строку `<Text c="dimmed">{t('emptyList')}</Text>` («There are no chats yet» / «Чатов пока нет»). Пустая таблица с одной строкой заголовков колонок не отображается; отдельного состояния «загрузка» нет — до получения ответа компонент возвращает `null`.
- Обоснование: замечание гейта — пустой список не должен выглядеть как пустой экран; ровно этот приём уже используется в разделах `Cron.WebUi` (`{list.length ? <Table…/> : <Text>{t('emptyList')}</Text>}`) и `Scripts.WebUi`, поэтому поведение раздела единообразно с остальными и текст попадает в общий механизм локализации.
- Альтернативы: (а) показывать таблицу с заголовками колонок и пустым телом — выглядит как сбой загрузки, замечание гейта именно об этом; (б) собственный крупный блок пустого состояния с иконкой и кнопкой действия — действий над чатами в разделе нет (раздел только для чтения), блок был бы декоративным и отличался бы от остальных разделов.
- Последствия: в кейсете и обоих `.resx` появляется ключ `emptyList`; текст сообщения — часть требования «Состояние пустого списка чатов» и проверяется вручную в браузере.
- promote: false

### D6. Ссылка на корневой странице добавляется в компонент `Home` оболочки

- Решение: в список ссылок компонента `Home` (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`) добавляется пункт со ссылкой на `/telegram-chat-list` с английским текстом, как у соседних пунктов.
- Обоснование: корневая страница целиком живёт в оболочке и перечисляет разделы статически; прецедент — ссылка на `/cron`, добавленная тем же способом (коммит `69745f3`). Способ минимален и не меняет требования capability оболочки.
- Альтернативы: строить список ссылок из `/api/webui/meta` — технически возможно, но это расширение объёма (нужны названия разделов в метаданных и их локализация), в запросе такого нет.
- Последствия: инфраструктурный плагин получает ещё одну строку знания о прикладном разделе; требуется пересборка бандла оболочки (vite) при сборке решения.
- promote: false

### D7. Ошибка загрузки — уведомление и запись в лог, список не отображается

- Решение: при ошибке запроса раздел пишет сообщение в лог через `useLogger` и показывает `toaster.showError(t('errorLoad'))`; состояние списка остаётся незаполненным, таблица не рендерится. Отмена запроса при уходе со страницы (`AbortController`) ошибкой не считается.
- Обоснование: точный приём из `Cron.WebUi/frontend/tasks.tsx` и `Scripts.WebUi`; единообразие поведения разделов важнее собственного экрана ошибки.
- Альтернативы: собственный экран ошибки внутри раздела (см. Q4) — отличался бы от остальных разделов.
- Последствия: при ошибке пользователь видит пустую область раздела и всплывающее уведомление; состояние ошибки визуально отличается от пустого списка (там есть сообщение, здесь — уведомление).
- promote: false

### D8. Локализация по образцу Cron.WebUi

- Решение: тексты по умолчанию английские в `Keyset('en', …)`; переводы — `Lang/TelegramChatListWebUiPlugin.resx` и `…ru-RU.resx`, ключи совпадают с ключами кейсета.
- Обоснование: соглашение «Тексты UI» из `conventions.md`; механизм `/api/webui/lang` выдаёт строки по `langId` плагина.
- Альтернативы: тексты только на английском — расходится с остальными разделами при `culture: ru-RU` в конфигурации хоста.
- Последствия: появляются два `.resx`-файла, ключи нужно держать синхронными с кейсетом.
- promote: false

### D9. Сборка клиентской части через `th-build`, копия конфигурации Cron.WebUi

- Решение: `package.json` со скриптами `build:development` / `build:production` (`th-build … --outDir Resources/app`) и `thPlugin.entries`; в `.csproj` — таргеты `NpmInstall`, `BuildClientDevelopment`, `BuildClientProduction`, `EmbeddedResource Include="Resources\**\*"`, импорт `../Package.xml`, `TargetFramework` `net10.0`; версии зависимостей — как в `ThinkingHome.Plugins.Cron.WebUi/package.json`.
- Обоснование: единственный поддерживаемый в проекте способ сборки бандла раздела; React, Mantine, `@thinking-home/ui` остаются внешними (import map), что запрещает их бандлить.
- Альтернативы: собственная конфигурация сборки (vite и т. п.) — дублирует инфраструктуру и рискует забандлить внешние зависимости.
- Последствия: при чистой сборке `dotnet build ThinkingHome.sln` нужно выполнять дважды (см. «Риски»); `Resources/app/**` не коммитится.
- promote: false

### D10. Подключение к хосту и документация в том же изменении

- Решение: проект добавляется в `ThinkingHome.sln`, в `ProjectReference` `ThinkingHome.Console.csproj` и в список `assemblies` файла `ThinkingHome.Console/appsettings.json`; README плагина и строка в корневом `README.md` пишутся в этом же изменении.
- Обоснование: раздел без подключения к хосту не появится в интерфейсе; в проекте публичный API плагина описывается его README (`conventions.md`).
- Альтернативы: оставить подключение владельцу — раздел не проверить и не увидеть после сборки.
- Последствия: администраторы с собственным списком `assemblies` добавляют плагин сами.
- promote: false

## Вопросы, требующие решения

| ID | Приоритет | Вопрос | Варианты | Рекомендация | Влияние |
|---|---|---|---|---|---|
| Q1 | P1 | Трактовка `{plugin}` в правиле «Разделы UI: `/{plugin}`» для пакета `TelegramChatList.WebUi` | A: `/telegram-chat-list` — alias доменного пакета, как `/cron` и `/scripts` (применено в D2); B: `/telegram-chat-list/chats` — форма `/{plugin}/{page}`; C: `/telegram-chat-list/web-ui` — буквальный alias пакета раздела | A | Адрес раздела фиксируется спецификацией, README и ссылкой на корневой странице; смена варианта — правка одной константы, требования «Раздел списка чатов» и «Переход в раздел с корневой страницы» и README |
| Q2 | P1 | Где фиксировать требование «ссылка на раздел есть на корневой странице»: содержимое корневой страницы не описано ни одной capability | A: требование в новой capability `plugins/telegram-chat-list/web-ui` (применено); B: дельта к `plugins/web-ui/application-shell`; C: не фиксировать в спецификациях | A | При A требование новой capability выполняется кодом плагина `WebUi` — «владелец» требования и место правки расходятся; при B меняется истина capability оболочки, которую изменение не должно трогать; при C поведение из запроса остаётся непроверяемым |
| Q3 | P2 | Формат показа поля `date` | A: форматирование по языку интерфейса (`lang` из контекста, применено в D4); B: строка ISO-8601 как пришла от API | A | Читаемость против буквального соответствия ответу API; на состав полей и контракт не влияет |
| Q4 | P2 | Поведение раздела при ошибке загрузки | A: уведомление `toaster.showError` и пустая область, как в Cron.WebUi и Scripts.WebUi (применено в D7); B: собственный экран ошибки в теле раздела | A | Затрагивает только сценарий «Запрос списка чатов завершился ошибкой»; вариант B потребует отдельного текста и отличия от остальных разделов |

## Соответствие правилам

Правил (`rules`) в пакете нет. Применимые ограничения — соглашения проекта:

- `conventions.md`, «Именование»: проект `ThinkingHome.Plugins.TelegramChatList.WebUi`, класс `TelegramChatListWebUiPlugin`, раздел `/{plugin}`, ресурсы `Lang/{PluginClass}.resx` — соблюдено в D1, D2, D8.
- «Правила формирования URL» (`ThinkingHome.Plugins.WebServer.UrlValidation/README.md`, `openspec/specs/plugins/web-server/url-validation/spec.md`, `glossary.md`): alias вычислен по правилу, адрес раздела выведен из него — разбор в D2; собственных HTTP-ресурсов раздел не регистрирует, поэтому адресов вида `/api/…`, `/dynamic/…`, `/static/…` изменение не добавляет.
- `conventions.md`, «Запрещено»: React, react-router, Mantine и `@thinking-home/ui` не бандлятся (внешние через import map), шрифты и библиотеки из интернета не грузятся, `Resources/app/**` не коммитится — соблюдено в D9.
- `conventions.md`, «Язык»: клиентский код TypeScript + React с `"jsx": "react"`, комментарии на русском, тексты UI по умолчанию английские; README плагина на русском — соблюдено в D8, D10.
- `architecture.md`, «Границы модулей»: UI не ссылается на доменный плагин и не открывает сессию БД — соблюдено в D1; порядок записей задаётся там, где данные читаются из БД, — в `.WebApi`-плагине через `DatabasePlugin.OpenSession()` (D3), новых зависимостей между проектами это не добавляет.
- `conventions.md`, «Коммиты»: агент не коммитит; изменения готовятся и предлагаются владельцу.

## Риски и компромиссы

- Адрес документа раздела регистрирует `WebUiPlugin` (его alias — `web-ui`), поэтому любой адрес раздела вида `/telegram-chat-list` попадает в отчёт `/dynamic/web-server/url-validation/errors.txt` как `invalid url prefix` — ровно так же, как уже существующие `/cron`, `/scripts`, `/page1`; тем же образом туда попадает адрес бандла `/static/webui/js/{hash}.js`. В коде рядом стоит `// TODO: подумать про пути к корневой странице + валидацию путей` → мера: отчёт сравнивается с состоянием до изменения (новых видов ошибок быть не должно, добавляются две строки того же вида, что и у каждого существующего раздела); исправление адресации разделов в `WebUiPlugin` — вне объёма изменения.
- Чистая сборка не кладёт свежий бандл в DLL с первого раза (`EmbeddedResource Include="Resources\**\*"` вычисляется до `th-build`) → в задачах предусмотрен повторный прогон `dotnet build ThinkingHome.sln`.
- Правка `Application.tsx` меняет бандл оболочки, а не только новый проект → сборка решения целиком (vite для `ThinkingHome.Plugins.WebUi`) входит в проверки; ссылка проверяется на корневой странице вручную.
- Сборка требует Node по `.nvmrc` (24) и доступа npm для `npm ci` → при недоступности npm сборка клиентской части падает; фиксируется как блокер реализации, обхода в изменении нет.
- Ответ API отдаётся целиком, без пагинации → при большом числе чатов таблица длинная; ограничение принято запросом осознанно.
- Меняется поведение работающего API, которым могут пользоваться и внешние клиенты → мера: меняется только порядок записей, состав полей и параметры прежние; прежний порядок контрактом не задавался, поэтому клиенты на него опираться не могли. Новый порядок описан в дельте `plugins/telegram-chat-list/http-api` и в README плагина `.WebApi`.
- Сортировка по `Date` выполняется без индекса по этому столбцу (`ThinkingHome.Plugins.TelegramChatList/Model/Migrations/Migration01.cs` создаёт только первичный ключ по `Id` и уникальное ограничение по `ChatId`) → при нынешних объёмах (записи по числу чатов бота) стоимость сортировки незначительна; индекс не добавляем, чтобы не менять модель хранения и не расширять объём изменения.
- При равных значениях `date` порядок таких записей не определён → мера: для проверки берутся записи с разными датами; для пользователя порядок равных дат неразличим по смыслу.
- Поле `date` приходит без часового пояса → показанное время трактуется как локальное; расхождение при разнице часовых поясов сервера и браузера принимается.
- Пустой список и ошибка загрузки — два разных состояния с похожей пустой областью → мера: при пустом списке всегда есть текст `emptyList`, при ошибке текста в теле раздела нет, но есть уведомление и запись в логе (D5, D7).
- Автотестов клиентской части нет → регрессия раздела ловится только сборкой, `tsc` и ручной проверкой; компенсируется тем, что раздел только читает данные.

## Стратегия проверки

Уровни по `testing.md`:

- unit (C#): не применим ни к разделу (серверной логики, кроме регистрации страницы, в нём нет), ни к новому порядку записей — `GetChatList` работает через `DatabasePlugin.OpenSession()`, а уровень «плагин с зависимостями» в `testing.md` помечен «—» (инфраструктуры для тестов с PostgreSQL в проекте нет).
- unit/component (TypeScript): не применим — тест-раннера для `frontend/**` в проекте нет.
- Регрессия: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — существующие тесты должны остаться зелёными (`ThinkingHome.Tests` не ссылается ни на `TelegramChatList*`, ни на `WebUi`, поэтому изменение их области не касается).
- Сборка: `dotnet build ThinkingHome.sln` (при чистой сборке дважды) — собираются новый проект, бандл раздела, пересобранный бандл оболочки и изменённый `TelegramChatList.WebApi`.
- Типы: `npx tsc -p tsconfig.json` в каталоге `ThinkingHome.Plugins.TelegramChatList.WebUi`.
- Ручной сценарий (выполняет человек, в задачах не планируется): запуск `ThinkingHome.Console` с PostgreSQL и несколькими записями о чатах с разными датами; проверка ответа API (`curl 'http://localhost:8080/api/telegram-chat-list/web-api/list'` — записи идут по убыванию `date`); переход с `/` по новой ссылке, проверка таблицы со всеми полями и совпадения порядка строк с порядком ответа API; проверка состояния пустого списка (база без записей о чатах — вместо таблицы сообщение); сравнение `/dynamic/web-server/url-validation/errors.txt` с состоянием до изменения.

## Миграция и откат

- Миграций БД нет: таблица `TelegramChatList_Chat` и её схема не затрагиваются.
- Применение: собрать решение, убедиться, что в `assemblies` хоста есть `ThinkingHome.Plugins.TelegramChatList.WebUi` (вместе с `ThinkingHome.Plugins.TelegramChatList` и `…WebApi`), перезапустить приложение.
- Откат: убрать строку из `assemblies` — раздел исчезнет (ссылка в `Home` и порядок записей в ответе API останутся до отката правок `Application.tsx` и `TelegramChatListWebApiPlugin.cs`); полный откат — revert коммита изменения, после чего API снова отдаёт записи в порядке СУБД. Данные не затрагиваются, обратной несовместимости нет.
