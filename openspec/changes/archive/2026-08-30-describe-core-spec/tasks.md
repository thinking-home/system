## 1. core/application-bootstrap

- [x] 1.1 Сверить требования спецификации `specs/core/application-bootstrap/spec.md` построчно с `ThinkingHome.Core.Infrastructure/HomeApplication.cs` и `HomeConfiguration.cs`; убедиться, что нет расхождений с текущим поведением

## 2. core/plugin-model

- [x] 2.1 Сверить требования спецификации `specs/core/plugin-model/spec.md` с `ThinkingHome.Core.Plugins/PluginBase.cs`, `IServiceContext.cs`, `PluginsOrder.cs` и `ThinkingHome.Core.Infrastructure/ServiceContext.cs`; убедиться, что нет расхождений с текущим поведением

## 3. core/event-dispatch

- [x] 3.1 Сверить требования спецификации `specs/core/event-dispatch/spec.md` с `ThinkingHome.Core.Plugins/PluginBase.cs` (`SafeInvoke`/`SafeInvokeAsync`) и `EventContext.cs`; убедиться, что нет расхождений с текущим поведением

## 4. core/object-registry

- [x] 4.1 Сверить требования спецификации `specs/core/object-registry/spec.md` с `ThinkingHome.Core.Plugins/Utils/BaseRegistry.cs`, `ObjectRegistry.cs`, `ObjectSetRegistry.cs`, `BaseConfigurationBuilder.cs` и `Extensions.cs` (`FindAttrs`/`FindMethods`); убедиться, что нет расхождений с текущим поведением

## 5. Завершение

- [x] 5.1 Прогнать `npx openspec validate describe-core-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
