## Общая картина

Пользователь открывает корневую страницу веб-интерфейса, видит в списке разделов пункт «Telegram chats» и переходит на `/telegram-chat-list`. Оболочка (`ThinkingHome.Plugins.WebUi`) по маршруту из `/api/webui/meta` подгружает бандл нового раздела и его локализацию, раздел через `ApiClient` из контекста запрашивает `/api/telegram-chat-list/web-api/list` и рисует таблицу.

Что меняется в компонентах:
- `ThinkingHome.Plugins.TelegramChatList.WebApi` — в запрос списка добавляется `OrderByDescending` по `Date` (требование «Список сохранённых чатов»).
- Новый `ThinkingHome.Plugins.TelegramChatList.WebUi` — регистрирует страницу и отдаёт бандл (требования «Зависимость от HTTP API списка чатов», «Раздел списка чатов», «Отображение незаданных значений и пустого списка», «Ошибка загрузки списка чатов»).
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — пункт в списке `Home` (требование «Ссылка на раздел списка чатов на корневой странице»).
- `ThinkingHome.Plugins.TelegramChatList` (хранение) не меняется.

Поток данных: браузер → оболочка (`/api/webui/meta`, бандл раздела, локализация) → раздел (`GET /api/telegram-chat-list/web-api/list`) → `TelegramChatListWebApiPlugin` → `DatabasePlugin.OpenSession()` → `TelegramChatList_Chat` (сортировка по `Date` убыв.) → JSON → valibot-схема → таблица Mantine.

## Единообразие

- Образец: `ThinkingHome.Plugins.Cron.WebUi`
- Новый модуль: `ThinkingHome.Plugins.TelegramChatList.WebUi`
- Места подключения образца: `ThinkingHome.sln` (запись проекта), `ThinkingHome.Console/ThinkingHome.Console.csproj` (`ProjectReference`), `ThinkingHome.Console/appsettings.json` (элемент `assemblies`), `README.md` (список плагинов репозитория), `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` (ссылка в списке `Home`; у образца — пункт `/cron`). Каждому соответствует задача в tasks.md.
- Исключения подключения: `ThinkingHome.Tests` — тест-проект не ссылается на UI-плагины (тестов для разделов в проекте нет, см. `testing.md`); `.cow/project/architecture.md` — карта проекта, обновляется отдельно от изменения.

Структура повторяет образец: `*Plugin.cs` c `[ConfigureWebUi]` и `Bundle()` из embedded `{name}.js/.gz/.br`, `frontend/api.ts` (valibot + `ApiClient`), `frontend/chats.tsx` (`createModule`, `useAppContext`, `useKeyset`, загрузка в `useEffect` с `AbortController`), `frontend/lang.ts` (`Keyset('en', …)`), `Lang/TelegramChatListWebUiPlugin.resx` и `.ru-RU.resx`, `package.json` (`thPlugin.entries`), `tsconfig.json`, `.csproj` (копия csproj образца с заменой описания), `README.md`.

Отступления от образца и причины: нет форм, изменяющих запросов и `toFormData` — раздел только для чтения (границы изменения); нет запроса типа `describe` — серверных подсказок для чатов нет; одна страница вместо нескольких — одна сущность.

## Контракты

- HTTP: `GET /api/telegram-chat-list/web-api/list` — состав полей и типы не меняются, добавляется гарантия порядка (`date` убыв.). Новых эндпоинтов нет.
- Регистрация раздела: `config.RegisterPage("/telegram-chat-list", Bundle("chats.js"))`; бандл `chats` объявляется в `thPlugin.entries` (`frontend/chats.tsx`).
- Клиентская схема valibot: `array(object({id: string, chatId: number, login: nullable(string), firstName: nullable(string), lastName: nullable(string), date: string}))`; тип `chatId` уточняется по модели `Chat` при реализации.
- UI: заголовок раздела и таблица Mantine `Table` со столбцами в порядке `chatId`, `login`, `firstName`, `lastName`, `date`, `id`; ключ строки — `id`. Идентификаторов для автотестов не вводится: браузерных тестов в проекте нет (`testing.md`).
- Локализация: ключи `title`, заголовки столбцов, `emptyList`, `errorLoad`; английский по умолчанию, русский — в `.ru-RU.resx`.

## Решения

### D1. Адрес раздела `/telegram-chat-list`, бандл `chats.js`

- Решение: маршрут раздела — `/telegram-chat-list`, имя бандла — `chats`.
- Обоснование: соглашение «Разделы UI: `/{plugin}`» из `conventions.md`, где alias плагина — `telegram-chat-list` (совпадает с alias HTTP API); имя `chats.js` — след прежней сборки раздела, найденный researcher.
- Альтернативы: короткий `/chats` — красивее, но не выводится из имени плагина и может конфликтовать с будущими разделами.
- Последствия: адрес длинный, но предсказуемый; закреплён требованием «Раздел списка чатов».
- promote: false

### D2. Сортировка выполняется в запросе к БД

- Решение: `OrderByDescending(x => x.Date)` добавляется в LINQ-запрос до материализации, а не сортировкой массива в памяти или на клиенте.
- Обоснование: порядок — часть контракта API (требование «Список сохранённых чатов»), сортировка выполняется СУБД по индексируемому полю; клиент остаётся без логики сортировки.
- Альтернативы: сортировка на клиенте — нарушает требование о фиксированном порядке на сервере и расходится с запросом.
- Последствия: другие потребители API получают тот же порядок; изменений в модели нет.
- promote: false

### D3. Состояние загрузки повторяет образец

- Решение: до получения ответа раздел ничего не рисует (`if (!list) return null;`), ошибка показывается через `toaster.showError` и пишется в логгер, отмена запроса при уходе со страницы ошибкой не считается.
- Обоснование: точное повторение `Cron.WebUi/frontend/tasks.tsx`; единообразие поведения разделов.
- Альтернативы: собственный индикатор загрузки и экран ошибки внутри раздела — отступление от образца без причины.
- Последствия: требование «Ошибка загрузки списка чатов» выполняется уведомлением, таблица не отображается.
- promote: false

### D4. Дата отображается локальным форматом браузера

- Решение: значение `date` выводится через `toLocaleString()` текущей локали браузера, без собственного парсера и библиотек форматирования.
- Обоснование: в раздел не тянутся новые зависимости (внешние пакеты ограничены import map), пользователь видит время в своём часовом поясе.
- Альтернативы: вывод строки ISO как есть — точнее для диагностики, но менее читаемо.
- Последствия: формат зависит от локали браузера; спецификация формат не фиксирует (см. Q2).
- promote: false

## Вопросы, требующие решения

| ID | Приоритет | Вопрос | Варианты | Рекомендация | Влияние |
|---|---|---|---|---|---|
| Q1 | P1 | Адрес раздела и подпись ссылки на корневой странице | `/telegram-chat-list` + «Telegram chats» / `/chats` + «Chats» | `/telegram-chat-list` + «Telegram chats» (D1) | Адрес закреплён требованием «Раздел списка чатов»; смена после реализации ломает закладки |
| Q2 | P2 | Формат отображения даты и нужен ли столбец `id` в таблице | локальный формат браузера и `id` показывается (запрос: «все поля») / ISO-строка / `id` скрыть | локальный формат, `id` последним столбцом | Внешний вид таблицы; контракт данных не меняется |

## Соответствие правилам

Правил в пакете нет. Из `conventions.md` соблюдается: именование проекта `{Name}.WebUi` и класса `{Name}WebUiPlugin`, схема URL `/api/{alias}/web-api/{method}` и `/{plugin}` для раздела, валидация данных valibot, тексты UI по умолчанию на английском с `.resx`-переводами, React/Mantine/@thinking-home/ui не бандлятся, `Resources/app/**` не коммитится.

## Риски и компромиссы

- Плагин не подключён в `appsettings.json`/`.csproj`/`.sln` → раздел не появляется при запуске, компиляция молчит → отдельные задачи на каждое место подключения, проверка через `cow wiring`.
- Чистая сборка падает или бандл не попадает в ресурсы из-за порядка `th-build` и `EmbeddedResource` → сборка решения дважды, как описано в `architecture.md`.
- Порядок записей меняет поведение существующего API для других потребителей → изменение зафиксировано в дельте `plugins/telegram-chat-list/http-api`, состав полей прежний.

## Стратегия проверки

- unit (C#): для сортировки списка потребовалась бы БД и `DatabasePlugin` — инфраструктуры component-тестов в проекте нет (`testing.md`), автотест не планируется.
- Раздел UI: тест-раннера для `frontend/**` нет; проверяется `npx tsc -p tsconfig.json` в каталоге нового проекта и `dotnet build ThinkingHome.sln`.
- `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — регрессия существующих тестов.
- Схема URL раздела и API — проверка `/dynamic/web-server/url-validation/errors.txt` при ручном запуске (вне задач реализации).

## Миграция и откат

—
