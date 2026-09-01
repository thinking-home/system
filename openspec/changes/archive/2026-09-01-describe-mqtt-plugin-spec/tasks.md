## 1. plugins/mqtt/broker-connection

- [x] 1.1 Сверить требования спецификации `specs/plugins/mqtt/broker-connection/spec.md` с `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 2. plugins/mqtt/topic-subscriptions

- [x] 2.1 Сверить требования спецификации `specs/plugins/mqtt/topic-subscriptions/spec.md` с `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs`, `DynamicConfiguration/ConfigureMqttAttribute.cs` и `DynamicConfiguration/MqttConfigurationBuilder.cs`; убедиться, что нет расхождений с текущим поведением

## 3. plugins/mqtt/publishing

- [x] 3.1 Сверить требования спецификации `specs/plugins/mqtt/publishing/spec.md` с `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs`; убедиться, что нет расхождений с текущим поведением

## 4. Завершение

- [x] 4.1 Прогнать `openspec validate describe-mqtt-plugin-spec --strict` и убедиться, что все спецификации проходят валидацию без ошибок
