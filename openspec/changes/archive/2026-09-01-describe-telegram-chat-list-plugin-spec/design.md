## Context

`TelegramChatList` (+ `TelegramChatList.WebApi`) — следующий по очереди плагин после `NooLite` (см. `proposal.md — Why`). `TelegramChatList` зависит от `TelegramBot` (событие `OnMessageReceived`, уже специфицировано в `plugins/telegram-bot/inbound-message-handling`) и `Database` (`plugins/database/*`). `TelegramChatList.WebApi` дополнительно зависит от `TelegramChatList` (модель `Chat`) и `WebServer` (`plugins/web-server/http-resources`). У `TelegramChatList`, в отличие от `Scripts`/`Cron`, нет `WebUi`.

## Goals / Non-Goals

**Goals:**
- Зафиксировать наблюдаемое поведение `TelegramChatListPlugin` (создание/обновление записи о чате по входящему сообщению, структура и уникальность хранимых данных) и `TelegramChatListWebApiPlugin` (HTTP-эндпоинт списка чатов) как baseline-спецификацию.

**Non-Goals:**
- Изменение кода плагинов — документируется поведение as-is.
- Повторное описание контракта события `OnMessageReceived` — он уже специфицирован в `plugins/telegram-bot/inbound-message-handling`; спецификация `TelegramChatList` только ссылается на него.
- Описание общего контракта регистрации HTTP-ресурсов — он уже специфицирован в `plugins/web-server/http-resources`.

## Decisions

- **Две capability вместо одной.** `TelegramChatList` (сохранение данных) и `TelegramChatList.WebApi` (HTTP API чтения) — отдельные проекты с разными зависимостями (WebApi зависит от WebServer, ядро — нет), как это уже сделано для пар `Cron`/`Cron.WebApi` и `Scripts`/`Scripts.WebApi`. Отсюда две capability: `plugins/telegram-chat-list/chat-tracking` и `plugins/telegram-chat-list/http-api`.
- **Подписка на `OnMessageReceived`, а не на команды бота.** Плагин обрабатывает вообще все входящие сообщения (без фильтрации по авторизации и типу чата — `OnMessageReceived` вызывается для каждого сообщения, см. `plugins/telegram-bot/inbound-message-handling`), поэтому в chat-tracking нет требований об авторизации или типе чата.
- **Upsert по `ChatId`.** Код ищет существующую запись по `ChatId` и либо создаёт новую с новым `Id`, либо обновляет найденную — это фиксируется как единая операция «создать-или-обновить», а не как два независимых требования.

## Risks / Trade-offs

- Спецификация написана по чтению кода и README плагинов (тестов в репозитории для этих двух плагинов нет) — возможны расхождения в неочевидных деталях. Митигация: формулировки ограничены поведением, видимым в коде и README, без домыслов.
