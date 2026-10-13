---
id: project.testing
summary: Unit-тесты xunit в ThinkingHome.Tests, проверки упаковки, HTTP-источников, планирования, установки и восстановления в ThinkingHome.Packaging.Tests, прототип загрузки, команды dotnet test с фильтрами, TRX-отчёты и отсутствие JSON, правило именования тестов по цепочке capability › требование › сценарий, e2e нет, ручные проверки интеграций
read_when: Перед написанием тестов, реализацией и верификацией
updated: 2026-10-14
verification: needs-review
---

# Тестирование и проверки

## Уровни тестов

| Уровень | Когда применять | Где лежат | Чем запускаются |
|---|---|---|---|
| unit (C#) | чистая логика без БД, сети и устройств: реестры, `FindMethods`, `MetaFilter`, `ScriptContext`, разбор команд Telegram | `ThinkingHome.Tests/{Area}/*.cs`; области `Core.Plugins`, `Plugins.Scripts`, `Plugins.TelegramBot` | xunit 2.9, Moq 4.20, `dotnet test` |
| component (C#) | настоящие nupkg, метаданные DLL, контракты, графы версий, карта загрузки, установка, locked-восстановление, откат и блокировки, локальный Kestrel и HTTP-клиент без внешней сети | `ThinkingHome.Packaging.Tests` | `dotnet test` |
| unit и component (TypeScript) | — : тест-раннера для каталогов `ThinkingHome.Plugins.*/frontend/**` нет, скриптов `test` в `package.json` нет | — | — |
| e2e | — : см. «Среда e2e» | — | — |

Проект ThinkingHome.Tests ссылается только на `ThinkingHome.Core.Plugins`, `ThinkingHome.Plugins.Scripts`, `ThinkingHome.Plugins.TelegramBot` (`ThinkingHome.Tests/ThinkingHome.Tests.csproj`); для тестов другого плагина добавьте `ProjectReference`.

## Команды

Выполнять из корня репозитория.

| Задача | Команда |
|---|---|
| Тесты ядра и плагинов (без npm) | `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` |
| Один класс | `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj --filter "FullyQualifiedName~ThinkingHome.Tests.Plugins.Scripts.MetaFilterTests"` |
| Один тест | `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj --filter "FullyQualifiedName=ThinkingHome.Tests.Plugins.Scripts.MetaFilterTests.Serialize_SortsKeys"` |
| Тесты одной capability | `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj --filter "DisplayName~plugins/scripts/script-events"` |
| Сборка решения целиком, включая `npm ci` и бандлы (нужен Node 24 по `.nvmrc`; при чистой сборке — дважды, см. `architecture.md`) | `dotnet build ThinkingHome.sln` |
| Сборка без клиентской части | `dotnet build ThinkingHome.Tests/ThinkingHome.Tests.csproj` |
| Проверка типов TS одного UI-проекта | `cd ThinkingHome.Plugins.Scripts.WebUi && npx tsc -p tsconfig.json` |
| Линтер | — : не настроен |
| Проверка схемы URL | запустить приложение и открыть `/dynamic/web-server/url-validation/errors.txt` |

Дополнительные проверки поставки плагинов:

```shell
dotnet test ThinkingHome.Packaging.Tests/ThinkingHome.Packaging.Tests.csproj -m:1 -p:UseSharedCompilation=false -p:NuGetAudit=false
dotnet run --project prototypes/PluginLoading/Harness/Harness.csproj -- . Debug
```

Прототип проверяет изоляцию двух версий приватной библиотеки, типизированные ссылки между плагинами, DI, обработчики и построение модели EF без обращения к БД. Он не входит в решение.

Тесты упаковки создают пакеты в собственных временных каталогах под `artifacts/packaging-tests` и удаляют их после завершения. Проверки не требуют работающего приложения или внешнего репозитория. `bin/obj` остаются обычными выходными каталогами сборки.

В этой среде для последовательной сборки без сервера компилятора применяются `-m:1 -p:UseSharedCompilation=false`; `-p:NuGetAudit=false` отключает сетевой аудит пакетов, а не тесты.

## Отчёты

Этап 5, 14 октября 2026 года, Windows x64 / .NET SDK 10.0.401: 85 тестов поставки пакетов (включая 20 сценариев установки/восстановления и проверку зафиксированного источника) и 43 теста ядра и плагинов — успешно. Полная сборка решения прошла без ошибок и предупреждений. Проверены смена версии с удерживаемым снимком, дедупликация, locked-копия без выбора версий, офлайн-валидация/ремонт, ошибки и отмена до commit, блокировки, обе ветви recovery и CLI через локальный HTTP. Отдельный запуск: `dotnet test ThinkingHome.Packaging.Tests/ThinkingHome.Packaging.Tests.csproj --filter FullyQualifiedName~ManagementTests`. Linux и отключение питания отдельно не проверялись.

Этап 4, 14 октября 2026 года: 64 теста упаковки, источников и планирования, включая 22 новых сценария; 43 теста ядра и плагинов — успешно. Полная сборка решения прошла. Команда запуска тестов поставки остаётся той же; отдельный запуск планирования: `dotnet test ThinkingHome.Packaging.Tests/ThinkingHome.Packaging.Tests.csproj --filter FullyQualifiedName~PlanningTests`.

Проверка 14 октября 2026 года, Windows x64 / .NET SDK 10.0.401: 43 теста ядра и плагинов, 42 теста упаковки и источников, 18 проверок прототипа загрузки — успешно. Linux отдельно не проверялся. Команда `sbox doctor` недоступна: CLI `sbox` не найден в PATH.

Полная сборка решения прошла в два прохода для включения сгенерированных UI-ресурсов. Для восстановления npm-пакетов потребовалась сеть, для запуска frontend-сборщика — выполнение вне ограничений sandbox. npm сообщил об уязвимостях уровня high в существующих зависимостях UI; версии и lock-файлы в этой работе не менялись.

- TRX: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj --logger trx --results-directory TestResults`; файлы `TestResults/*.trx`, каталог игнорируется git (`[Tt]est[Rr]esult*/` в `.gitignore`).
- JSON: не установлено, вопрос отложен до шага тестирования первого изменения. `sbox coverage --report` принимает `jest=path` и `playwright=path`; логгера JSON для xunit и конвертера TRX в проекте нет. Тогда же решить, принимает ли установленный sdd формат `trx` или JUnit XML (пакет `JunitXml.TestLogger`).
- CI нет, отчёты никуда не выгружаются.

## Именование тестов по сценариям

Цепочка спецификации: `# {capability} Specification` → `### Requirement: {требование}` → `#### Scenario: {сценарий}` в `openspec/specs/{capability}/spec.md`. В xunit нет `describe` и `it`, поэтому цепочка кладётся так:

| Уровень OpenSpec | Аналог в describe/it | В xunit |
|---|---|---|
| capability | внешний `describe` | один класс на capability в пространстве `ThinkingHome.Tests.{Area}`, атрибут `[Trait("capability", "{id}")]` |
| требование | вложенный `describe` | часть `DisplayName` между разделителями `›`; при желании — вложенный класс с именем требования в PascalCase |
| сценарий | `it` | `[Fact(DisplayName = "{capability} › {требование} › {сценарий}")]`; текст требования и сценария — дословно из спецификации, имя метода — по правилу `Действие_Результат_WhenУсловие` |

Пример для `openspec/specs/plugins/scripts/script-events/spec.md`:

```csharp
namespace ThinkingHome.Tests.Plugins.Scripts;

[Trait("capability", "plugins/scripts/script-events")]
public class ScriptEventsSpecTests
{
    [Fact(DisplayName = "plugins/scripts/script-events › Фильтрация подписки по meta › Подписка без фильтра")]
    public void EmptyFilter_MatchesAnyMeta()
    {
        Assert.True(MetaFilter.IsMatch("", Meta("name", "test")));
        Assert.True(MetaFilter.IsMatch(null, null));
    }

    [Fact(DisplayName = "plugins/scripts/script-events › Фильтрация подписки по meta › Подписка с фильтром, meta события не совпадает")]
    public void Filter_DoesNotMatch_WhenKeyMissing()
    {
        Assert.False(MetaFilter.IsMatch("topic=test", Meta("name", "test")));
    }

    // Meta(key, value) — вспомогательный метод класса, строит словарь meta из одной пары
}
```

Исторические тесты написаны до этого правила и `DisplayName` не задают. Если в UI-проектах появится тест-раннер, цепочка ложится напрямую: `describe(capability)` → `describe(требование)` → `it(сценарий)`.

## Среда e2e

— : e2e-тестов нет. Ручная проверка: локальный PostgreSQL (контейнер `postgres`, пароль `123` по `README.md`), файл `appsettings.Development.json` в `ThinkingHome.Console` (не в git), запуск `cd ThinkingHome.Console && dotnet run`, веб-интерфейс на порту из `plugins:ThinkingHome.Plugins.WebServer.WebServerPlugin:port` (8080 в `appsettings.json`).

## Не автоматизируется

| Что | Почему |
|---|---|
| nooLite (адаптер MTRF-64) | нужно физическое устройство на `portName` |
| Telegram-бот | нужен реальный токен и аккаунт из `authorizedLogins` |
| MQTT и SMTP | нужен брокер или почтовый сервер; `ThinkingHome.Plugins.Mqtt/README.md` описывает брокер в контейнере для отладки |
| Расписание cron в реальном времени | проверка раз в 20 с и окно 5 мин; логика `CronScheduleItem.IsActive` тестируема, но покрытия нет |
| Веб-интерфейс: разделы, тема, уведомления, SignalR | браузерных тестов нет; проверять в браузере |
| Миграции БД | применяются только при старте на реальном PostgreSQL |
