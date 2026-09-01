## 1. plugins/database/connection-and-migrations

- [x] 1.1 Сверить требования спецификации `specs/plugins/database/connection-and-migrations/spec.md` с `ThinkingHome.Plugins.Database/DatabasePlugin.cs` (`InitPlugin`, `ApplyMigrations`); убедиться, что нет расхождений с текущим поведением

## 2. plugins/database/data-access-api

- [x] 2.1 Сверить требования спецификации `specs/plugins/database/data-access-api/spec.md` с `ThinkingHome.Plugins.Database/DatabasePlugin.cs` (`OpenSession`), `HomeDbContext.cs`, `DbModelBuilderAttribute.cs` и `DbModelBuilderDelegate.cs`; убедиться, что нет расхождений с текущим поведением

## 3. Завершение

- [x] 3.1 Прогнать `npx openspec validate describe-database-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
