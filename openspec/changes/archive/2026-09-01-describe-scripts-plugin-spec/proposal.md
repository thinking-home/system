## Why

`Scripts`, `Scripts.WebApi` и `Scripts.WebUi` (следующие по порядку зависимостей плагины после `Database`) пока не описаны спецификациями. `Scripts` зависит только от `Database` и предоставляет остальным плагинам API для выполнения пользовательских JavaScript-сценариев и сценарные события — на этот контракт будут ссылаться будущие спецификации плагинов, инициирующих сценарные события (Cron+WebApi+WebUi, Mail, Mqtt, NooLite, TelegramChatList+WebApi). `Scripts.WebApi` предоставляет HTTP API для управления сценариями и подписками на сценарные события, а `Scripts.WebUi` — раздел веб-интерфейса поверх этого HTTP API (сам README `Scripts.WebUi` требует совместной установки с `Scripts.WebApi`), поэтому все три плагина описываются одним изменением.

## What Changes

- Добавить спецификацию капабилити `plugins/scripts/script-execution`: выполнение JavaScript-сценариев (`ExecuteScript`, `ExecuteScript(UserScript)`, `ExecuteScriptByName`), объект `host` в сценарии (`host.log`, `host.api` через `[ScriptCommand]`, `host.scripts`, `host.emit`), переменные `args`/`meta`, таймаут выполнения, работа с бинарными данными через `Buffer`, хранение сценариев (`UserScript`).
- Добавить спецификацию капабилити `plugins/scripts/script-events`: регистрация сценарных событий плагинами (`[ConfigureScriptEvents]`, `ScriptEventsConfigurationBuilder`, `RegisterEvent`), инициация событий и асинхронный вызов подписанных сценариев, пользовательское событие (`EmitUserEvent`, `scripts:user-event`), фильтрация подписок по meta (`MetaFilter`), хранение подписок (`ScriptEventHandler`), поведение при отсутствии плагина `Scripts`.
- Добавить спецификацию капабилити `plugins/scripts/http-api`: HTTP-эндпоинты `Scripts.WebApi` для CRUD сценариев, их выполнения, получения списка зарегистрированных событий и CRUD подписок на события.
- Добавить спецификацию капабилити `plugins/scripts/web-ui`: разделы веб-интерфейса `Scripts.WebUi` (список сценариев, редактор, подписки на события) и их зависимость от `plugins/scripts/http-api`.

## Capabilities

### New Capabilities
- `plugins/scripts/script-execution`: выполнение сохранённых и переданных напрямую JavaScript-сценариев, доступное сценариям API (`host`), хранение сценариев
- `plugins/scripts/script-events`: регистрация сценарных событий плагинами, их инициация и асинхронная обработка подписанными сценариями, пользовательские события, фильтрация подписок
- `plugins/scripts/http-api`: HTTP API для управления сценариями, их выполнения и управления подписками на сценарные события
- `plugins/scripts/web-ui`: разделы веб-интерфейса для работы со сценариями и подписками на их события

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.Scripts/*` (ScriptsPlugin, Internal/*, Events/*, Attributes/*, Model/*, Buffer)
- `ThinkingHome.Plugins.Scripts.WebApi/ScriptsWebApiPlugin.cs`
- `ThinkingHome.Plugins.Scripts.WebUi/ScriptsWebUiPlugin.cs`
- Новые спецификации: `openspec/specs/plugins/scripts/script-execution/spec.md`, `openspec/specs/plugins/scripts/script-events/spec.md`, `openspec/specs/plugins/scripts/http-api/spec.md`, `openspec/specs/plugins/scripts/web-ui/spec.md`
