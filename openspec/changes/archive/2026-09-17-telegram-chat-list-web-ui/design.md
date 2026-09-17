# Design

## Context

Проект уже содержит два аналогичных плагина веб-интерфейса — `ThinkingHome.Plugins.Cron.WebUi` (см. `plugins/cron/web-ui`) и `ThinkingHome.Plugins.Scripts.WebUi` (см. `plugins/scripts/web-ui`), каждый из которых регистрирует раздел через `[ConfigureWebUi]` (`plugins/web-ui/page-registration`) и получает данные через HTTP API соответствующего плагина. Плагин `ThinkingHome.Plugins.TelegramChatList.WebApi`, предоставляющий `plugins/telegram-chat-list/http-api`, уже подключён в `ThinkingHome.Console/appsettings.json`. Главная страница веб-интерфейса (`ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`, компонент `Home`) уже содержит ссылки на разделы `Scripts` и `Schedule` в виде статического списка.

## Goals / Non-Goals

**Goals:**
- Новый плагин `ThinkingHome.Plugins.TelegramChatList.WebUi`, структурно повторяющий `ThinkingHome.Plugins.Cron.WebUi` (csproj, frontend, Lang, README).
- Страница `/telegram-chat-list`, отображающая одну таблицу со всеми записями и всеми полями, без пагинации и фильтров.
- Ссылка на раздел в списке `Home`.

**Non-Goals:**
- Редактирование, удаление записей или любые другие действия над чатами — раздел только для чтения.
- Пагинация, сортировка, поиск, фильтрация — прямо исключены задачей.

## Decisions

- **Отдельный плагин, а не расширение `TelegramChatList.WebApi`**: повторяет сложившийся в проекте паттерн разделения HTTP API и веб-интерфейса на отдельные плагины (`Cron` / `Cron.WebApi`... /`Cron.WebUi`, `Scripts` / `Scripts.WebUi`). Альтернатива (встроить страницу в `WebApi`-плагин) отклонена как нарушающая существующее разделение ответственности.
- **URL раздела — `/telegram-chat-list`**: следует шаблону остальных разделов (`/cron`, `/scripts`) — путь совпадает с именем capability/плагина.
- **Таблица без пагинации/фильтров**: read-only список рендерится одним запросом `/api/telegram-chat-list/web-api/list`, без клиентского или серверного постраничного вывода — соответствует прямому требованию задачи.
- **Подключение плагина**: `ThinkingHome.Plugins.TelegramChatList.WebUi` добавляется в `assemblies` в `ThinkingHome.Console/appsettings.json` рядом с `ThinkingHome.Plugins.TelegramChatList.WebApi`.
- **Ссылка на главной**: добавляется как ещё один пункт статического списка в компоненте `Home`, по аналогии с существующими пунктами `Scripts` и `Schedule`; отдельного requirement в спеках `plugins/web-ui/*` для этого списка нет (прецедент — ссылки на `Cron`/`Scripts` тоже не описаны формальным requirement), поэтому изменение остаётся на уровне реализации.

## Risks / Trade-offs

- [Список чатов может со временем сильно разрасти таблицу без пагинации] → приемлемо: задача прямо исключает пагинацию и фильтры для текущей итерации; при необходимости пагинация добавляется отдельным изменением.
