---
id: project.conventions
summary: C# и TypeScript, русские комментарии и коммиты, стиль из DotSettings без линтеров и CI, запреты (async void, прямой вызов обработчиков, свой DbContext, URL вне схемы), именование плагинов, событий, таблиц, тестов, веток
read_when: Перед написанием кода и тестов, при ревью
updated: 2026-09-15
verification: needs-review
---

# Соглашения по коду

## Язык

| Что | Язык | Пример |
|---|---|---|
| Серверный код | C# для `net10.0` с primary constructors и collection expressions | `ThinkingHome.Plugins.Cron/CronPlugin.cs` |
| Клиентский код | TypeScript 7, React 19, JSX через `React.createElement` (`"jsx": "react"` в `tsconfig.json`) | `ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx` |
| Идентификаторы, сообщения лога, ключи конфигурации, имена событий | английский | `Logger.LogInformation("register script event: {Name}")` |
| Комментарии в коде | русский; объясняют «почему», а не «что» | `ThinkingHome.Core.Plugins/EventContext.cs` |
| Сообщения коммитов | русский, строчная буква, без точки | `git log` |
| README плагинов, спецификации, `.sbox` | русский | `ThinkingHome.Plugins.Scripts/README.md` |
| Тексты UI | по умолчанию английский в `Keyset('en', …)`, переводы в `Lang/{Plugin}.resx` (en) и `Lang/{Plugin}.ru-RU.resx` | `ThinkingHome.Plugins.Scripts.WebUi/frontend/lang.ts` |

## Стиль

- Единого форматтера и линтера нет: в репозитории нет `.editorconfig`, ESLint, Prettier, StyleCop, `dotnet format` не настроен. Стиль задаёт `ThinkingHome.sln.DotSettings` (ReSharper и Rider): расстановка скобок, именование констант и приватных полей.
- Фактический стиль C#: отступ 4 пробела; приватные поля `camelCase` без подчёркивания (`lockObject`); приватные константы `UPPER_SNAKE` (`CHECK_INTERVAL`); публичные константы `PascalCase` (`TaskStartedEventName`); группировка `#region`; в новых файлах открывающая скобка класса на той же строке, в старых — на новой, при правке сохранять стиль файла.
- Публичный API плагина описан в `README.md` его проекта: конфигурация, методы, сценарные команды, сценарные события. Изменил API — обнови README и спецификацию в `openspec/specs`.
- Проверка типов TS: `npx tsc -p tsconfig.json` в каталоге UI-проекта (`noEmit`, `noImplicitAny`); отдельного npm-скрипта для этого нет.
- Данные с сервера на клиенте валидируются схемами valibot через `api.get(schema, {url})` из @thinking-home/ui.

## Запрещено

| Запрет | Почему | Где закреплено |
|---|---|---|
| Обработчики `async void` | исключение не поймать в `EventContext`, процесс упадёт; `FindMethods` бросает при регистрации | `ThinkingHome.Core.Plugins/Utils/Extensions.cs` |
| Вызывать найденные обработчики напрямую в цикле | ошибка одного прервёт остальные; использовать `SafeInvoke` и `SafeInvokeAsync` | `ThinkingHome.Core.Plugins/PluginBase.cs` |
| Цикл `while (true)` с выходом через `break` | нужен явный флаг или условие цикла; правило владельца репозитория | этот документ; анализатором не проверяется |
| Свой `DbContext` или прямое подключение к БД | только `DatabasePlugin.OpenSession()`; модель через `[DbModelBuilder]`, схема через миграции | `ThinkingHome.Plugins.Database/README.md` |
| Загрузка шрифтов и библиотек из интернета в веб-интерфейсе | система работает в локальной сети | `ThinkingHome.Plugins.Scripts.WebUi/ScriptsWebUiPlugin.cs` |
| URL вне схемы `/api/{alias}/…`, `/dynamic/{alias}/….ext`, `/static/{alias}/…`, `/vendor/…` | ловит `UrlValidationPlugin` | `ThinkingHome.Plugins.WebServer.UrlValidation/README.md` |
| Бандлить React, react-router, Mantine, @thinking-home/ui в раздел | ломает единый экземпляр React; они внешние через import map | `ThinkingHome.Plugins.WebUi/vite.config.mts` |
| Коммитить `Resources/app/**`, `appsettings.Development.json`, `launchSettings.json`, `bin`, `obj`, `logs` | сборочные и локальные файлы | `.gitignore` |
| `Task.Factory.StartNew` без параметров | неудачные умолчания; используется `Task.Run` | `ThinkingHome.Core.Plugins/EventContext.cs` |
| `Run()` и `ConsoleLifetime` у веб-хоста | перехватывают Ctrl+C; используется `Start()` и пустой lifetime | `ThinkingHome.Plugins.WebServer/WebServerPlugin.cs` |
| Новые секреты в коде и в `ThinkingHome.Console/appsettings.json` | секреты — в `appsettings.Development.json` или переменных `THINKINGHOME_*` | `ThinkingHome.Console/README.md` |

## Именование

| Объект | Правило | Пример |
|---|---|---|
| Проект плагина | `ThinkingHome.Plugins.{Name}`, класс `{Name}Plugin`; HTTP API — `{Name}.WebApi`, UI — `{Name}.WebUi` | `ThinkingHome.Plugins.Cron.WebApi/CronWebApiPlugin.cs` |
| Атрибут-обработчик | `{Name}Attribute` и делегат `{Name}Delegate` в отдельных файлах; билдер — `{Name}ConfigurationBuilder` | `ThinkingHome.Plugins.Timer/TimerCallbackAttribute.cs` |
| Секция конфигурации | полное имя класса плагина внутри `plugins` | `ThinkingHome.Plugins.Mqtt.MqttPlugin` |
| Таблицы БД | `{Plugin}_{Entity}` | `Scripts_UserScript`, `Cron_Task`, `TelegramChatList_Chat` |
| Миграции | `*/Model/Migrations/Migration*.cs` с `[Migration(N)]` | `ThinkingHome.Plugins.Scripts/Model/Migrations/Migration03.cs` |
| Сценарные события | `{plugin}:{object}:{event}` в kebab-case, константа `…EventName` в плагине | `cron:task:started`, `noolite:data:received` |
| Ключи meta | константы `…MetaKey` | `taskId`, `topic`, `channel`, `command`, `name` |
| Сценарные команды | camelCase с префиксом плагина, задаётся в `[ScriptCommand("…")]` | `mqttPublishString`, `sendMail` |
| URL API | `/api/{alias}/web-api/{method}`, alias — имя пакета без префикса в kebab-case | `/api/scripts/web-api/list` |
| Разделы UI | `/{plugin}` и `/{plugin}/{page}`; имя бандла — ключ `thPlugin.entries` в `package.json` | `/scripts/edit` собирается из `ThinkingHome.Plugins.Scripts.WebUi/frontend/editor.tsx` |
| Ресурсы локализации | `Lang/{PluginClass}.resx`, `Lang/{PluginClass}.ru-RU.resx` | `ThinkingHome.Plugins.Cron.WebUi/Lang` |
| Тестовые файлы | `ThinkingHome.Tests/{Area}/{Class}Tests.cs`, пространство `ThinkingHome.Tests.{Area}` | `ThinkingHome.Tests/Plugins.Scripts/MetaFilterTests.cs` |
| Тестовые методы | `Действие_Результат_WhenУсловие`; тесты по спецификации — см. `testing.md` | `RegisterEvent_ThrowsException_WhenNameIsEmpty` |
| Ветки | kebab-case по теме без префикса; изменения sdd — с префиксом sbox/ (`branchPrefix` в `.sbox/config.yaml`) | `script-events`, `ui-vite-build` |

## Коммиты

- Сообщение: одна строка на русском, строчная буква, без точки, без префиксов `feat:` и подобных; допускается область через двоеточие (`mqtt: документация`).
- Один коммит — одна логическая правка; в истории встречаются коммиты `fix`, так не делать.
- Не коммитить сборочные артефакты и секреты (см. «Запрещено»).
- Слияние в `master` — только через пул-реквест на GitHub с merge commit вида `Merge pull request #N from thinking-home/{branch}`.
- Агенты не коммитят и не пушат сами: подготовить изменения, прогнать проверки, предложить сообщение коммита владельцу.
