## 1. plugins/noolite/device-connection

- [x] 1.1 Сверить требования спецификации `specs/plugins/noolite/device-connection/spec.md` с `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/noolite/data-handlers

- [x] 2.1 Сверить требования спецификации `specs/plugins/noolite/data-handlers/spec.md` с `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs`, `NooLiteCommandHandlerAttribute.cs`, `NooLiteCommandHandlerDelegate.cs`, `NooLiteMicroclimateDataHandlerAttribute.cs`, `NooLiteMicroclimateDataHandlerDelegate.cs`; убедиться, что нет расхождений с текущим поведением

## 3. plugins/noolite/adapter-control

- [x] 3.1 Сверить требования спецификации `specs/plugins/noolite/adapter-control/spec.md` с `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs` и `AdapterWrapper.cs`; убедиться, что нет расхождений с текущим поведением

## 4. plugins/noolite/script-events

- [x] 4.1 Сверить требования спецификации `specs/plugins/noolite/script-events/spec.md` с `ThinkingHome.Plugins.NooLite/NooLitePlugin.cs`, `NooLiteDataEventArgs.cs`, `NooLiteMicroclimateEventArgs.cs`; убедиться, что нет расхождений с текущим поведением

## 5. Завершение

- [x] 5.1 Прогнать `openspec validate describe-noolite-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
