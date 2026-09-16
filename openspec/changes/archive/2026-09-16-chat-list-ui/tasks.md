## 1. Порядок записей в HTTP API списка чатов

- [x] 1.1 В `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`, метод `GetChatList`, упорядочить выборку по убыванию `Chat.Date` (`OrderByDescending(x => x.Date)` до проекции, как в `CronWebApiPlugin.GetTaskList`) — требование «Список сохранённых чатов» (`plugins/telegram-chat-list/http-api`), D3
- [x] 1.2 Описать фиксированный порядок ответа (по убыванию `date`, самая новая запись первой) в `ThinkingHome.Plugins.TelegramChatList.WebApi/README.md`, раздел про `/api/telegram-chat-list/web-api/list` (техническая, D3)

## 2. Каркас проекта раздела

- [x] 2.1 Создать проект `ThinkingHome.Plugins.TelegramChatList.WebUi/ThinkingHome.Plugins.TelegramChatList.WebUi.csproj` по образцу `ThinkingHome.Plugins.Cron.WebUi.csproj`: импорт `../Package.xml`, `TargetFramework` `net10.0`, `Description`, таргеты `NpmInstall`, `BuildClientDevelopment`, `BuildClientProduction`, `EmbeddedResource Include="Resources\**\*"`, ссылки только на `Core.Plugins`, `WebServer`, `WebUi` (техническая, D1 и D9)
- [x] 2.2 Добавить `package.json` с `thPlugin.entries` = `{ "chats": "frontend/chats.tsx" }`, скриптами `build`, `build:development`, `build:production` и зависимостями версий из `ThinkingHome.Plugins.Cron.WebUi/package.json`; сгенерировать `package-lock.json` через `npm install` (техническая, D9)
- [x] 2.3 Добавить `tsconfig.json` по образцу `ThinkingHome.Plugins.Cron.WebUi/tsconfig.json` (техническая, D9)
- [x] 2.4 Добавить проект в `ThinkingHome.sln` (техническая, D10)

## 3. Серверная часть раздела

- [x] 3.1 Создать класс `TelegramChatListWebUiPlugin : PluginBase` с константой префикса ресурсов `ThinkingHome.Plugins.TelegramChatList.WebUi.Resources.app.` и хелпером `Bundle(name)`, собирающим `StaticResource` из бандла и копий `.gz`/`.br` (техническая, D9)
- [x] 3.2 В методе с `[ConfigureWebUi]` зарегистрировать раздел `config.RegisterPage("/telegram-chat-list", Bundle("chats.js"))` — требование «Раздел списка чатов» (адрес раздела по правилам формирования URL, D2)
- [x] 3.3 Добавить `Lang/TelegramChatListWebUiPlugin.resx` и `Lang/TelegramChatListWebUiPlugin.ru-RU.resx` с ключами `title`, `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, `emptyList`, `errorLoad` (перевод `emptyList` — «Чатов пока нет», `errorLoad` — «Не удалось загрузить данные») — требование «Локализация раздела списка чатов»

## 4. Клиентская часть раздела

- [x] 4.1 Написать `frontend/api.ts`: схема valibot для ответа списка чатов (`id`, `login`, `chatId`, `firstName`, `lastName`, `date`) и функция запроса `GET /api/telegram-chat-list/web-api/list` через `ApiClient` — требование «Зависимость от HTTP API списка чатов»
- [x] 4.2 Написать `frontend/lang.ts` с `Keyset('en', …)`, ключи которого совпадают с ключами `.resx` (в том числе `emptyList: 'There are no chats yet'`) — требование «Локализация раздела списка чатов»
- [x] 4.3 Написать компонент раздела `frontend/chats.tsx`: загрузка списка в `useEffect` с `AbortController`, `useAppContext()`, `useKeyset`, `useLogger`, экспорт `createModule(Component)`; до получения ответа компонент возвращает `null` — требование «Зависимость от HTTP API списка чатов»
- [x] 4.4 Вывести таблицу Mantine со всеми полями записи о чате в порядке `id`, `login`, `chatId`, `firstName`, `lastName`, `date`, без действий добавления, редактирования и удаления — требование «Раздел списка чатов»
- [x] 4.5 Рендерить строки в том порядке, в котором записи пришли от API, не переупорядочивая массив на клиенте и не добавляя средств смены порядка — требование «Порядок вывода чатов», D3
- [x] 4.6 Отображать прочерк в ячейках полей `login`, `firstName`, `lastName`, пришедших как `null` — требование «Отсутствующие значения полей чата»
- [x] 4.7 Форматировать `date` для показа по языку интерфейса (`lang` из контекста приложения) — требование «Раздел списка чатов», D4
- [x] 4.8 Отрисовать состояние пустого списка: при пустом ответе API вместо таблицы показывать `<Text c="dimmed">{t('emptyList')}</Text>`, таблицу вместе со строкой заголовков колонок не рендерить, заголовок раздела оставить — требование «Состояние пустого списка чатов», D5
- [x] 4.9 При ошибке запроса писать сообщение в лог раздела и показывать уведомление `toaster.showError(t('errorLoad'))`, не отображая таблицу; отмену запроса по `AbortSignal` ошибкой не считать — требование «Ошибка загрузки списка чатов», D7

## 5. Ссылка на корневой странице

- [x] 5.1 Добавить в список ссылок компонента `Home` (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`) пункт со ссылкой на `/telegram-chat-list` — требование «Переход в раздел списка чатов с корневой страницы», D6

## 6. Подключение к хосту и документация

- [x] 6.1 Добавить `ProjectReference` на новый проект в `ThinkingHome.Console/ThinkingHome.Console.csproj` (техническая, D10)
- [x] 6.2 Добавить `ThinkingHome.Plugins.TelegramChatList.WebUi` в список `assemblies` файла `ThinkingHome.Console/appsettings.json` (техническая, D10)
- [x] 6.3 Написать `ThinkingHome.Plugins.TelegramChatList.WebUi/README.md` по образцу `ThinkingHome.Plugins.Cron.WebUi/README.md`: назначение раздела, адрес `/telegram-chat-list`, состав полей, порядок по убыванию даты (обеспечивает HTTP API), поведение при пустом списке, зависимость от плагина HTTP API (техническая, D10)
- [x] 6.4 Добавить строку о новом плагине в список плагинов корневого `README.md` (техническая, D10)

## 7. Проверки

- [x] 7.1 Прогнать `dotnet build ThinkingHome.sln` (при чистой сборке — дважды подряд) и убедиться, что изменённый `TelegramChatList.WebApi`, новый проект и бандлы собираются без ошибок
- [x] 7.2 Прогнать `npx tsc -p tsconfig.json` в каталоге `ThinkingHome.Plugins.TelegramChatList.WebUi` и убедиться в отсутствии ошибок типов
- [x] 7.3 Прогнать `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` и убедиться, что существующие тесты зелёные
