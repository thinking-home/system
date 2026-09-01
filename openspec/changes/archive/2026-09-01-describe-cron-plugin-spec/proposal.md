## Why

`Cron`, `Cron.WebApi` и `Cron.WebUi` (следующие по очереди плагины после семейства `Scripts`) пока не описаны спецификациями. `Cron` зависит от `Database`, `Scripts` и `Timer` и предоставляет плагинам и сценариям автоматизации возможность запускать действия по расписанию. `Cron.WebApi` предоставляет HTTP API для управления расписанием, а `Cron.WebUi` — раздел веб-интерфейса поверх этого HTTP API (README `Cron.WebUi` требует совместной установки с `Cron.WebApi`), поэтому все три плагина описываются одним изменением.

## What Changes

- Добавить спецификацию капабилити `plugins/cron/task-scheduling`: хранение записей расписания (`CronTask`), формат выражения cron (NCrontab), периодическая проверка расписания и кэширование (`ReloadTasks`), правило "активных" запусков (не более `ACTIVE_PERIOD` минут в прошлом, не чаще раза за проверку), запуск обработчиков плагинов (`[CronHandler]`, `CronHandlerDelegate`), генерация пользовательского сценарного события задачи и события `cron:task:started` (meta `taskId`), поведение при некорректном выражении в БД.
- Добавить спецификацию капабилити `plugins/cron/http-api`: HTTP-эндпоинты `Cron.WebApi` для CRUD записей расписания, проверки и человекочитаемого описания выражения cron, сброс кэша расписания при изменении данных.
- Добавить спецификацию капабилити `plugins/cron/web-ui`: раздел веб-интерфейса `Cron.WebUi` (список, добавление, редактирование, удаление записей расписания) и его зависимость от `plugins/cron/http-api`.

## Capabilities

### New Capabilities
- `plugins/cron/task-scheduling`: хранение и проверка расписания, запуск обработчиков плагинов и генерация событий при наступлении времени
- `plugins/cron/http-api`: HTTP API для управления записями расписания и проверки выражений cron
- `plugins/cron/web-ui`: раздел веб-интерфейса для управления расписанием

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.Cron/*` (CronPlugin, CronScheduleItem, CronHandlerAttribute, CronHandlerDelegate, Model/*)
- `ThinkingHome.Plugins.Cron.WebApi/CronWebApiPlugin.cs`
- `ThinkingHome.Plugins.Cron.WebUi/CronWebUiPlugin.cs`
- Новые спецификации: `openspec/specs/plugins/cron/task-scheduling/spec.md`, `openspec/specs/plugins/cron/http-api/spec.md`, `openspec/specs/plugins/cron/web-ui/spec.md`
