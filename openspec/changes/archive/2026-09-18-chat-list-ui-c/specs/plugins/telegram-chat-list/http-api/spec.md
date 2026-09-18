## MODIFIED Requirements

### Requirement: Список сохранённых чатов

Динамический ресурс `/api/telegram-chat-list/web-api/list` SHALL без параметров возвращать список всех записей о чатах, сохранённых `plugins/telegram-chat-list/chat-tracking`. Каждая запись в ответе SHALL представляться объектом с полями `id`, `login`, `chatId`, `firstName`, `lastName` и `date`, соответствующими одноимённым (с точностью до регистра) полям хранимой записи о чате. Записи в ответе SHALL быть упорядочены по полю `date` по убыванию; порядок SHALL быть фиксированным и SHALL не зависеть от параметров запроса.

#### Scenario: Запрос списка чатов

- **WHEN** выполняется запрос `/api/telegram-chat-list/web-api/list`
- **THEN** в ответе возвращается список всех сохранённых записей о чатах, каждая — с полями `id`, `login`, `chatId`, `firstName`, `lastName` и `date`

#### Scenario: Отсутствующие значения полей

- **WHEN** у записи о чате не заданы `Login`, `FirstName` или `LastName`
- **THEN** соответствующие поля (`login`, `firstName`, `lastName`) в объекте ответа возвращаются как `null`

#### Scenario: Порядок записей в ответе

- **GIVEN** в таблице чатов есть записи с разными значениями `Date`
- **WHEN** выполняется запрос `/api/telegram-chat-list/web-api/list`
- **THEN** записи в ответе идут в порядке убывания `date`: запись с самой поздней датой — первая
