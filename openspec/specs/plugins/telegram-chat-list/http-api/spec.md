# plugins/telegram-chat-list/http-api Specification

## Purpose

Предоставляет HTTP API для просмотра списка чатов Telegram, сохранённых контрактом `plugins/telegram-chat-list/chat-tracking`, поверх контракта `plugins/web-server/http-resources`.

## Requirements

### Requirement: Список сохранённых чатов

Динамический ресурс `/api/telegram-chat-list/web-api/list` SHALL без параметров возвращать список всех записей о чатах, сохранённых `plugins/telegram-chat-list/chat-tracking`. Каждая запись в ответе SHALL представляться объектом с полями `id`, `login`, `chatId`, `firstName`, `lastName` и `date`, соответствующими одноимённым (с точностью до регистра) полям хранимой записи о чате.

#### Scenario: Запрос списка чатов

- **WHEN** выполняется запрос `/api/telegram-chat-list/web-api/list`
- **THEN** в ответе возвращается список всех сохранённых записей о чатах, каждая — с полями `id`, `login`, `chatId`, `firstName`, `lastName` и `date`

#### Scenario: Отсутствующие значения полей

- **WHEN** у записи о чате не заданы `Login`, `FirstName` или `LastName`
- **THEN** соответствующие поля (`login`, `firstName`, `lastName`) в объекте ответа возвращаются как `null`
