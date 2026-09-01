## Purpose

Описывает скриптовые команды публикации сообщений в MQTT-топик, доступные сценариям через `Scripts`.

## ADDED Requirements

### Requirement: Публикация строкового сообщения (mqttPublishString)
Метод, зарегистрированный как скриптовая команда `mqttPublishString(topic, payload, retain?)`, SHALL опубликовать в указанный топик сообщение с содержимым `payload`, закодированным в байты UTF-8. Параметр `retain` SHALL быть необязательным и по умолчанию равен `false`. Скриптовая команда SHALL быть доступна сценариям согласно контракту `plugins/scripts/script-execution` — «Вызов методов плагинов из сценария (ScriptCommand)».

#### Scenario: Вызов mqttPublishString из сценария
- **WHEN** сценарий вызывает `host.api.mqttPublishString(topic, payload)` без параметра `retain`
- **THEN** в указанный топик публикуется сообщение с содержимым `payload` в кодировке UTF-8 и флагом retain, равным `false`

#### Scenario: Вызов mqttPublishString с retain
- **WHEN** сценарий вызывает `host.api.mqttPublishString(topic, payload, true)`
- **THEN** в указанный топик публикуется сообщение с содержимым `payload` в кодировке UTF-8 и флагом retain, равным `true`

### Requirement: Публикация бинарного сообщения (mqttPublishBuffer)
Метод, зарегистрированный как скриптовая команда `mqttPublishBuffer(topic, payload, retain?)`, SHALL принимать содержимое сообщения в виде `Buffer` (см. `plugins/scripts/script-execution`) и SHALL опубликовать в указанный топик сообщение с байтами, полученными из `payload`. Параметр `retain` SHALL быть необязательным и по умолчанию равен `false`.

#### Scenario: Вызов mqttPublishBuffer из сценария
- **WHEN** сценарий вызывает `host.api.mqttPublishBuffer(topic, payload)`, где `payload` — объект `Buffer`
- **THEN** в указанный топик публикуется сообщение с байтами из `payload` и флагом retain, равным `false`

### Requirement: Публикация с уровнем качества обслуживания "At Least Once"
Публикация сообщения (`mqttPublishString`/`mqttPublishBuffer`) SHALL выполняться с уровнем качества обслуживания (QoS) "At Least Once" и SHALL дожидаться подтверждения публикации брокером, прежде чем вызов скриптовой команды завершится. Если публикация завершается ошибкой (например, отсутствует соединение с брокером), ошибка SHALL быть проброшена вызвавшему сценарию.

#### Scenario: Успешная публикация
- **WHEN** публикация сообщения подтверждена брокером
- **THEN** вызов скриптовой команды публикации завершается без ошибки

#### Scenario: Ошибка публикации
- **WHEN** при публикации сообщения возникает ошибка (например, отсутствует соединение с брокером)
- **THEN** ошибка пробрасывается вызвавшему сценарию как результат вызова скриптовой команды публикации
