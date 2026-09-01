## 1. plugins/cron/task-scheduling

- [x] 1.1 Сверить требования спецификации `specs/plugins/cron/task-scheduling/spec.md` с `ThinkingHome.Plugins.Cron/CronPlugin.cs`, `CronScheduleItem.cs`, `CronHandlerAttribute.cs`, `CronHandlerDelegate.cs`, `Model/CronTask.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/cron/http-api

- [x] 2.1 Сверить требования спецификации `specs/plugins/cron/http-api/spec.md` с `ThinkingHome.Plugins.Cron.WebApi/CronWebApiPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 3. plugins/cron/web-ui

- [x] 3.1 Сверить требования спецификации `specs/plugins/cron/web-ui/spec.md` с `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs` и `frontend/{api.ts,tasks.tsx,lang.ts}`; убедиться, что нет расхождений с текущим поведением

## 4. Завершение

- [x] 4.1 Прогнать `npx openspec validate describe-cron-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
