## Общая картина

Пользователь открывает корневую страницу веб-интерфейса, видит новый пункт списка «Telegram chats» и переходит по нему на `/telegram-chat-list`. Оболочка `WebUi` находит маршрут в `/api/webui/meta`, подгружает ESM-бандл раздела и строки локализации, раздел через `useAppContext().api` запрашивает список чатов и рисует таблицу.

Что меняется в компонентах:
- новый проект `ThinkingHome.Plugins.TelegramChatList.WebUi` — регистрирует страницу и отдаёт бандл (весь новый код здесь);
- `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx` — один новый `List.Item` со ссылкой на раздел в хардкод-списке `Home`;
- `ThinkingHome.sln` и `ThinkingHome.Console/appsettings.json` — регистрация проекта и сборки;
- `TelegramChatList.WebApi`, `TelegramChatList`, `WebServer`, `WebUi` — без изменений.

Поток данных:

```
браузер → /api/webui/meta (WebUi) → бандл /static/telegram-chat-list-web-ui/… (TelegramChatList.WebUi)
        → GET /api/telegram-chat-list/web-api/list (TelegramChatList.WebApi) → БД (Database)
        → valibot-схема → Mantine Table
```

## Единообразие

Образец — `ThinkingHome.Plugins.Cron.WebUi` (read-only часть): `ThinkingHome.Plugins.Cron.WebUi/ThinkingHome.Plugins.Cron.WebUi.csproj` (таргеты `NpmInstall`/`BuildClientDevelopment`/`BuildClientProduction`, `EmbeddedResource Resources\**\*`, ссылки на `Core.Plugins`, `WebServer`, `WebUi`), `CronWebUiPlugin.cs` (`[ConfigureWebUi]` + `RegisterPage(url, Bundle(name))` с предсжатыми копиями), `frontend/api.ts` (valibot-схема + `api.get`), `frontend/tasks.tsx` (`createModule`, `useAppContext`, `useKeyset`, `useLogger`, загрузка в `useEffect` с `AbortController`, `Mantine Table`, ветка пустого списка), `frontend/lang.ts` + `Lang/CronWebUiPlugin*.resx`, `package.json`/`tsconfig.json`.

Отступления и причины:
- нет формы, кнопок сохранения/удаления и debounce-запросов — раздел read-only по границам изменения (proposal, «Не входит»);
- нет `models/` — модель раздела исчерпывается типом строки, выведенным из схемы valibot;
- из keyset исключены ключи действий (add/save/delete и их тосты) — соответствующих действий нет.

Иных отступлений от образца нет.

## Контракты

- Потребляемый HTTP API (без изменений): `GET /api/telegram-chat-list/web-api/list` → массив объектов `{id: string, login: string|null, chatId: number, firstName: string|null, lastName: string|null, date: string}`. Точные типы `chatId` и `date` в JSON проверяются по факту при реализации; схема valibot — единственное место их фиксации на клиенте.
- Новый маршрут UI: `/telegram-chat-list` (`RegisterPage`), бандл — entry `chats` в `thPlugin.entries` (`frontend/chats.tsx`).
- Ресурсы локализации: `Lang/TelegramChatListWebUiPlugin.resx` (en) и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` (ru).
- Ключи keyset: `title`, колонки `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad`.
- Структура UI: `Title` с заголовком, далее либо `Table` с шестью колонками (`key` строки — `id`), либо `Text` с сообщением о пустом списке. Идентификаторов для автотестов не вводим: браузерных тестов в проекте нет (`testing.md`).
- Новых событий, схем БД и серверных контрактов нет.

## Решения

### D1. Отдельный проект `ThinkingHome.Plugins.TelegramChatList.WebUi`

- Решение: раздел живёт в новом проекте-плагине, зависящем от `Core.Plugins`, `WebServer`, `WebUi`.
- Обоснование: граница из `architecture.md` — доменный плагин не ссылается на `WebServer`/`WebUi`, UI выносится в `.WebUi`; так же устроены `Cron.WebUi` и `Scripts.WebUi`.
- Альтернативы: добавить UI в `TelegramChatList.WebApi` (нарушает разделение API/UI и именование проектов); в `Tmp` (песочница, не поставка).
- Последствия: +1 сборка в `assemblies`, +1 проект в решении, двойная сборка при чистом клоне.
- promote: false

### D2. URL раздела `/telegram-chat-list` и entry-файл `chats.tsx`

- Решение: маршрут совпадает с alias плагина, бандл называется `chats`.
- Обоснование: `conventions.md` — «Разделы UI: `/{plugin}`», alias `telegram-chat-list` уже используется в URL API; имя entry описывает содержимое страницы (как `tasks` в Cron.WebUi).
- Альтернативы: `/chats` (не привязан к плагину, риск конфликта ключей реестра URL), `/telegram/chats` (двухуровневый путь без второй страницы).
- Последствия: маршрут проходит проверку `url-validation` без исключений.
- promote: false

### D3. Отображение полей без серверного и клиентского форматирования

- Решение: все шесть полей выводятся как есть; `null` показывается пустой ячейкой; `date` выводится строкой ответа API без перевода в локальный формат.
- Обоснование: запрос требует «все поля таблицы»; форматирование — отдельное решение, за границами изменения; сервер отдаёт сырые поля.
- Альтернативы: форматировать дату через `Intl` (добавляет неоговорённое поведение и вопрос часового пояса — вынесено в Q1).
- Последствия: пользователь видит ISO-строку даты; при необходимости формат меняется отдельным изменением.
- promote: false

### D4. Загрузка один раз при открытии раздела

- Решение: список запрашивается в `useEffect` с `AbortController` при монтировании; кнопки обновления и подписки на шину сообщений нет.
- Обоснование: повторяет `tasks.tsx`; realtime-обновление исключено границами изменения.
- Альтернативы: подписка на топик хаба (нет серверного уведомления о новых чатах — потребовало бы менять доменный плагин).
- Последствия: чтобы увидеть новые чаты, пользователь перезагружает раздел.
- promote: false

### D5. Ошибки загрузки — через `toaster` и `logger` из контекста

- Решение: при ошибке запроса показывается тост `errorLoad`, текст ошибки уходит в `logger`; отменённый запрос (уход со страницы) ошибкой не считается.
- Обоснование: дословно приём `fail(...)` из `tasks.tsx`; `application-shell` даёт эти объекты в общем контексте.
- Альтернативы: собственный экран ошибки внутри раздела (дублирует оболочку).
- Последствия: поведение при ошибке единообразно с другими разделами.
- promote: false

## Вопросы, требующие решения

| ID | Приоритет | Вопрос | Варианты | Рекомендация | Влияние |
|---|---|---|---|---|---|
| Q1 | P2 | Формат отображения `date` | A: строка ответа как есть; B: локальный формат даты и времени | A | Только внешний вид колонки; переключение — правка одной ячейки |
| Q2 | P2 | Подпись раздела в интерфейсе и на корневой странице | A: «Telegram chats» / «Чаты Telegram»; B: «Chat list» / «Список чатов» | A | Тексты keyset и resx, пункт на корневой странице |

## Соответствие правилам

Правил в списке `rules` пакета нет. Применимые запреты из `conventions.md`: URL раздела и API в схеме `/api/{alias}/…` и `/{plugin}`; React, Mantine, `@thinking-home/ui` не бандлятся (внешние по `th-build`); данные с сервера валидируются valibot; тексты UI — английский по умолчанию, перевод в resx; `Resources/app/**` не коммитится.

## Риски и компромиссы

- Реальные JSON-типы `chatId` (число/строка) и `date` могут не совпасть с ожиданием → схема valibot упадёт на валидации: проверить фактический ответ API до фиксации схемы, при расхождении поправить схему, а не API.
- Чистая сборка не кладёт свежий бандл в DLL с первого раза → собирать `dotnet build ThinkingHome.sln` дважды (`architecture.md`).
- Плагин UI подключён без плагина API → раздел откроется, но данные не придут: покрыто требованием «Зависимость от HTTP API списка чатов», обе сборки добавляются в `assemblies` вместе.
- Хардкод-список ссылок на корневой странице растёт → правка точечная, механизм автоматической навигации за границами изменения.

## Стратегия проверки

- unit (C#): по `testing.md` тестируемой чистой логики в разделе нет (регистрация страницы — атрибут и константы), новых unit-тестов не планируется.
- TypeScript: `npx tsc -p tsconfig.json` в каталоге нового проекта (тест-раннера для frontend в проекте нет).
- Сборка: `dotnet build ThinkingHome.sln` (дважды при первом запуске), `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — регрессия.
- Ручная проверка (вне задач реализации): открыть `/telegram-chat-list`, корневую страницу, `/dynamic/web-server/url-validation/errors.txt`.

## Миграция и откат

Миграций БД и изменений данных нет. Откат: удалить проект из `ThinkingHome.sln` и сборку из `assemblies`, вернуть `Application.tsx`; состояние системы не затрагивается.
