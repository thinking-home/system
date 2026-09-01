## 1. plugins/scripts/script-execution

- [x] 1.1 Сверить требования спецификации `specs/plugins/scripts/script-execution/spec.md` с `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs`, `Internal/ScriptContext.cs`, `Internal/ScriptMethodContainer.cs`, `Internal/ScriptLogger.cs`, `Attributes/ScriptCommandAttribute.cs`, `Buffer.cs`, `Model/UserScript.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/scripts/script-events

- [x] 2.1 Сверить требования спецификации `specs/plugins/scripts/script-events/spec.md` с `ThinkingHome.Plugins.Scripts/ScriptsPlugin.cs` (регистрация и инициация событий, `EmitUserEvent`), `Events/ScriptEventsConfigurationBuilder.cs`, `Events/ScriptEventEmitter.cs`, `Events/ScriptEventDefinition.cs`, `Events/ConfigureScriptEventsAttribute.cs`, `Events/MetaFilter.cs`, `Model/ScriptEventHandler.cs`; убедиться, что нет расхождений с текущим поведением

## 3. plugins/scripts/http-api

- [x] 3.1 Сверить требования спецификации `specs/plugins/scripts/http-api/spec.md` с `ThinkingHome.Plugins.Scripts.WebApi/ScriptsWebApiPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 4. plugins/scripts/web-ui

- [x] 4.1 Сверить требования спецификации `specs/plugins/scripts/web-ui/spec.md` с `ThinkingHome.Plugins.Scripts.WebUi/ScriptsWebUiPlugin.cs` и README `ThinkingHome.Plugins.Scripts.WebUi`; убедиться, что нет расхождений с текущим поведением

## 5. Завершение

- [x] 5.1 Прогнать `npx openspec validate describe-scripts-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
