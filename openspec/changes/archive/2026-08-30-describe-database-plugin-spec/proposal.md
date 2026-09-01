## Why

Ядро (`describe-core-spec`) уже описано спецификациями. `ThinkingHome.Plugins.Database` — первый плагин без зависимостей от других плагинов (кроме ядра), от которого напрямую или косвенно зависит большинство остальных плагинов (Scripts, Cron, TelegramChatList и др.). Описание его контракта раньше их спецификаций позволяет ссылаться на него из последующих плагинных изменений.

## What Changes

- Задокументировать поведение `DatabasePlugin` как baseline-спецификацию: обязательная настройка `connectionString` (PostgreSQL), отказ запуска при отсутствии строки подключения.
- Задокументировать применение миграций БД при инициализации плагина: для каждой сборки плагина (без повторов) выполняется `Migrator.Migrate()` через `PostgreSQLProviderFactory`.
- Задокументировать API расширения модели данных для других плагинов: атрибут `[DbModelBuilder]` и делегат `DbModelBuilderDelegate` для настройки EF Core `ModelBuilder`.
- Задокументировать API доступа к данным: метод `OpenSession()`, возвращающий `DbContext` (`HomeDbContext`), собранный из всех зарегистрированных `DbModelBuilder`-методов всех плагинов.

## Capabilities

### New Capabilities
- `plugins/database/connection-and-migrations`: настройка подключения к БД и применение миграций при старте плагина.
- `plugins/database/data-access-api`: API для других плагинов — регистрация модели (`[DbModelBuilder]`) и открытие сессии (`OpenSession`).

### Modified Capabilities
(нет)

## Impact

- Затронутый код: `ThinkingHome.Plugins.Database/DatabasePlugin.cs`, `HomeDbContext.cs`, `DbModelBuilderAttribute.cs`, `DbModelBuilderDelegate.cs`.
- Новые спецификации: `openspec/specs/plugins/database/connection-and-migrations/spec.md`, `openspec/specs/plugins/database/data-access-api/spec.md`.
- Зависимости: только `ThinkingHome.Core.Plugins` (см. `core/plugin-model`); плагин используется другими плагинами (Scripts, Cron, TelegramChatList и др.), которые будут описаны позже и смогут ссылаться на эти спецификации.
