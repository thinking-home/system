## 1. plugins/web-server/http-resources

- [x] 1.1 Сверить требования спецификации `specs/plugins/web-server/http-resources/spec.md` с `ThinkingHome.Plugins.WebServer/WebServerPlugin.cs`, `WebServerConfigurationBuilder.cs`, `HomePluginsMiddleware.cs`, `Handlers/*.cs`, `Attributes/ConfigureWebServerAttribute.cs`, `HttpHandlerDelegate.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/web-server/message-bus

- [x] 2.1 Сверить требования спецификации `specs/plugins/web-server/message-bus/spec.md` с `ThinkingHome.Plugins.WebServer/Messages/MessageHub.cs`, `Messages/HubMessageHandlerDelegate.cs`, `WebServerConfigurationBuilder.cs` (`RegisterMessageHandler`), `WebServerPlugin.cs` (`Send`, подписка на `MessageHub.Message`); убедиться, что нет расхождений с текущим поведением

## 3. plugins/web-server/url-validation

- [x] 3.1 Сверить требования спецификации `specs/plugins/web-server/url-validation/spec.md` с `ThinkingHome.Plugins.WebServer.UrlValidation/UrlValidationPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 4. Завершение

- [x] 4.1 Прогнать `npx openspec validate describe-webserver-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
