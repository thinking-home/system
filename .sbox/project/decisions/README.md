# Постоянные правила проекта

## Управление пакетами плагинов

- [Архитектура](ADR-0001-plugin-package-management.md)
- [Состав MVP и отложенная функциональность](ADR-0002-plugin-package-management-mvp.md)
- [Порядок реализации](ADR-0003-plugin-package-management-stages.md)

Результаты первых пяти этапов: [прототип загрузки](../plugin-package-loading-prototype.md), [упаковка и контракты](../plugin-package-packaging.md), [источники и репозиторий](../plugin-package-sources.md), [план установки](../plugin-package-planning.md), [установка и восстановление](../plugin-package-installation.md). Следующий этап — интеграция установленных пакетов с хостом.

## Формат правил

Каждое правило — файл `ADR-NNNN-<slug>.md` с фронтматтером `id`, `title`, `status` (accepted | superseded), `scope` (пути или области), `accepted_by`, `accepted_at`, `origin`, `supersedes` и разделами «Правило», «Контекст», «Обоснование», «Последствия», «Как проверяется». Правило меняется только новым правилом со ссылкой `supersedes`.
