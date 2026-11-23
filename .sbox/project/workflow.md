---
id: project.workflow
summary: Ветки и пул-реквесты, ручной выпуск NuGet через GitHub Actions, ограничения для агентов и список безопасных команд
read_when: Перед коммитом, созданием ветки и пул-реквеста
updated: 2026-11-18
verification: needs-review
---

# Рабочий процесс

## Ветки

- Базовая ветка `master` (на неё указывает origin/HEAD; `baseBranch: master` в `.sbox/config.yaml`).
- Одна ветка на изменение; имя kebab-case по теме без префикса (`script-events`, `compression-and-ui-kit`, `dotnet10`); для изменений sdd — sbox/{id} (`branchPrefix` в `.sbox/config.yaml`).
- Долгоживущие ветки в `origin` (`dashboards`, `i18n`, `web-i18n`, `waterius`, `chatlistWebUI`, `docker-image`) — незавершённые эксперименты; не брать за основу без согласования с владельцем.

## Пул-реквесты

- Все слияния в `master` — через пул-реквест в GitHub-репозитории thinking-home/system, merge commit вида `Merge pull request #N from thinking-home/{branch}`.
- В описании: что меняется для владельца дома и для разработчика плагинов; какие `README.md` плагинов и файлы `openspec/specs` обновлены; как проверялось руками (какие плагины и интеграции запускались).
- Ревьюит и мержит владелец репозитория (автор в `Package.xml`) сам; шаблона PR, CODEOWNERS и защиты веток нет.
- Готовность: `dotnet build ThinkingHome.sln` (при чистой сборке — дважды, см. `architecture.md`) и `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` проходят локально, README и спецификации затронутых плагинов актуальны, `sbox doctor` без ошибок.

## Проверки CI

- Сборку решения и тесты для пул-реквестов запускают локально. Ручной workflow `.github/workflows/publish-nuget.yml` собирает полный комплект NuGet и проверяет установку CLI и Timer. Публикацию включает владелец при запуске. [Порядок выпуска](../../docs/nuget-release.md)
- Docker-образ собирается вручную командой `docker build -t dima117a/thinking-home:5.0.0-alpha.1 .` и публикуется в Docker Hub (`README.md`); внутри образа Node 24 и `dotnet publish -c Release` (`Dockerfile`).
- Шаблон workflow для GitHub можно создать командой `sbox ci install` — не применялось.

## Запрещено без человека

- `git commit`, `git push`, создание и мерж пул-реквестов: агент готовит изменения, проверяет и предлагает сообщение коммита; коммитит владелец.
- Правка и удаление существующих миграций (`*/Model/Migrations/*.cs`); новая миграция — только по явному согласию, потому что применяется автоматически при старте на боевой БД.
- Изменение `ThinkingHome.Console/appsettings.json` (параметры приложения и плагинов, токены, строки подключения) и `.sbox/config.yaml`. Состав плагинов задаётся установкой пакетного менеджера и локальным `plugins.local.json`; appsettings содержит их настройки.
- Публикация NuGet-пакетов, смена версии в `Package.xml`, сборка и push docker-образа.
- Добавление и обновление зависимостей (`npm install`, `dotnet add package`), правка `package-lock.json`.
- Удаление веток, force-push, правки вне `.sbox/project` в задачах на документацию.
- Запуск приложения с реальными интеграциями: Telegram-токен, nooLite, боевой PostgreSQL, SMTP.

## Разрешённые команды

Без подтверждения:

- Чтение: `git status`, `git log`, `git diff`, `git branch -a`, `ls`, `cat`, `grep`, `find`.
- Сборка и тесты: `dotnet build ThinkingHome.sln`, `dotnet build {project}.csproj`, `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` с любыми `--filter` и `--logger trx`.
- Клиент, в каталоге UI-проекта: `npm ci`, `npm run build`, `npm run build:development`, `npm run build:production`, `npx tsc -p tsconfig.json`.
- sdd: `sbox doctor`, `sbox-contract index`, `sbox-contract show {id}`, `sbox status`, `sbox validate`, `sbox change list`.
- Локальный запуск для проверки: `cd ThinkingHome.Console && dotnet run` при наличии `appsettings.Development.json` и локального PostgreSQL; порт переопределяется переменной `THINKINGHOME_plugins__ThinkingHome.Plugins.WebServer.WebServerPlugin__port`.
