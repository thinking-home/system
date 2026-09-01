## 1. plugins/web-ui/page-registration

- [x] 1.1 Сверить требования спецификации `specs/plugins/web-ui/page-registration/spec.md` с `ThinkingHome.Plugins.WebUi/WebUiPlugin.cs`, `WebUiConfigurationBuilder.cs`, `WebUiPageDefinition.cs`, `StaticManifest.cs`, `Attributes/ConfigureWebUiAttribute.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/web-ui/application-shell

- [x] 2.1 Сверить требования спецификации `specs/plugins/web-ui/application-shell/spec.md` с `ThinkingHome.Plugins.WebUi/frontend/index.tsx`, `frontend/components/{Application.tsx,Page.tsx,ErrorScreen.tsx}`, `frontend/utils/{api-client.ts,message-hub.ts,toaster.ts,types.ts}`; убедиться, что нет расхождений с текущим поведением

## 3. Завершение

- [x] 3.1 Прогнать `npx openspec validate describe-webui-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
