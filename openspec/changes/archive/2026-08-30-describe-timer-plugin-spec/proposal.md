## Why

Плагин `Timer` (следующий по очереди после `WebServer`/`WebServer.UrlValidation`) пока не описан спецификацией. Он предоставляет базовый механизм периодического выполнения кода по таймеру, на который будут опираться будущие спецификации других плагинов (Cron, TelegramBot и т.д.).

## What Changes

- Добавить спецификацию капабилити `plugins/timer/callback-scheduling`: регистрация методов-обработчиков плагинов атрибутом `[TimerCallback]`, вычисление задержки первого срабатывания и интервала повторов, запуск/остановка таймеров вместе с жизненным циклом плагина, обработка ошибок и логирование при вызове обработчика.

## Capabilities

### New Capabilities
- `plugins/timer/callback-scheduling`: периодический вызов методов-обработчиков плагинов по таймеру через атрибут `[TimerCallback]`

### Modified Capabilities
(нет)

## Impact

- `ThinkingHome.Plugins.Timer/*` (TimerPlugin, InternalTimer, TimerCallbackAttribute, TimerCallbackDelegate)
- Новая спецификация: `openspec/specs/plugins/timer/callback-scheduling/spec.md`
