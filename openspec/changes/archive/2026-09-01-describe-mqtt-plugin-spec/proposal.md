## Why

Плагин `Mqtt` (следующий по очереди после `Mail`, перед `NooLite`, `TelegramChatList`, `WebUi` и `Tmp`) пока не описан спецификацией. Он предоставляет подключение к MQTT-брокеру: публикацию сообщений из сценариев и подписку других плагинов/сценариев на топики через декларативную регистрацию обработчиков.

## What Changes

- Добавить спецификацию капабилити `plugins/mqtt/broker-connection`: конфигурация подключения к брокеру (хост, порт, логин/пароль), жизненный цикл клиента (подключение при старте, периодическая проверка/переподключение, отключение при остановке), обработка входящих сообщений и диспетчеризация по подписчикам.
- Добавить спецификацию капабилити `plugins/mqtt/topic-subscriptions`: декларативная регистрация обработчиков топика другими плагинами через атрибут `[ConfigureMqtt]` и `MqttConfigurationBuilder`, а также регистрация подписок на топики из конфигурации сценарных событий (`scriptEvents`), инициирующих пользовательские события `Scripts`.
- Добавить спецификацию капабилити `plugins/mqtt/publishing`: скриптовые команды `mqttPublishString` и `mqttPublishBuffer` для публикации сообщений в топик.

## Capabilities

### New Capabilities
- `plugins/mqtt/broker-connection`: подключение к MQTT-брокеру, конфигурация соединения, жизненный цикл клиента, приём и диспетчеризация входящих сообщений
- `plugins/mqtt/topic-subscriptions`: декларативная регистрация обработчиков топиков другими плагинами (`[ConfigureMqtt]`) и регистрация подписок из конфигурации `scriptEvents`, связывающих топик с пользовательским сценарным событием
- `plugins/mqtt/publishing`: скриптовые команды публикации сообщений в MQTT-топик

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.Mqtt/MqttPlugin.cs`
- `ThinkingHome.Plugins.Mqtt/DynamicConfiguration/ConfigureMqttAttribute.cs`
- `ThinkingHome.Plugins.Mqtt/DynamicConfiguration/MqttConfigurationBuilder.cs`
- Новые спецификации: `openspec/specs/plugins/mqtt/broker-connection/spec.md`, `openspec/specs/plugins/mqtt/topic-subscriptions/spec.md`, `openspec/specs/plugins/mqtt/publishing/spec.md`
