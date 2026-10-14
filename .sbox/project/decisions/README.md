# Постоянные правила проекта

## Управление пакетами плагинов

- [Архитектура](ADR-0001-plugin-package-management.md)
- [Состав MVP и отложенная функциональность](ADR-0002-plugin-package-management-mvp.md)
- [Порядок реализации](ADR-0003-plugin-package-management-stages.md)
- [Автоматическое обнаружение точек входа](ADR-0004-plugin-entry-point-discovery.md)
- [Совместимость через зависимость от ядра](ADR-0005-core-package-compatibility.md)
- [Автоматическое определение зависимостей и отметка shared](ADR-0006-reference-dependency-policy.md)

Документация: [упаковка и контракты](../plugin-package-packaging.md), [источники и репозиторий](../plugin-package-sources.md), [план установки](../plugin-package-planning.md), [установка и восстановление](../plugin-package-installation.md), [интеграция с хостом и локальные подключения](../plugin-package-runtime.md).

## Формат правил

Каждое правило — файл `ADR-NNNN-<slug>.md` с фронтматтером `id`, `title`, `status` (accepted | superseded), `scope` (пути или области), `accepted_by`, `accepted_at`, `origin`, `supersedes` и разделами «Правило», «Контекст», «Обоснование», «Последствия», «Как проверяется». Правило меняется только новым правилом со ссылкой `supersedes`.
