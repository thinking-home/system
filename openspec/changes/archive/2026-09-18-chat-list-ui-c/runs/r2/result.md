# Результат: planner / propose — chat-list-ui-c

## Сводка

- Записан `openspec/changes/chat-list-ui-c/proposal.md`: проблема (данные о чатах есть только в API/БД), границы (только read-only раздел со всеми полями, без пагинации/фильтров/CRUD/realtime), ссылка с корневой страницы, включение сборки в стандартную конфигурацию.
- Новая capability: `plugins/telegram-chat-list/web-ui`. Существующие capability не меняются: `plugins/telegram-chat-list/http-api` используется как есть, `plugins/web-ui/page-registration` и `plugins/web-ui/application-shell` задают уже действующий контракт.
- `cow validate` — ошибок нет (остались только info о заблокированных артефактах и warning об отсутствии дельт, ожидаемо для фазы propose).

## Оценка

- Размер: normal — одна новая capability, новый плагин-проект, без контрактных и миграционных изменений.
- Сложность реализации: обычная — есть полностью применимый образец `ThinkingHome.Plugins.Cron.WebUi` (read-only часть).
- Сложность ревью: обычная — поведение проверяется визуально и по одному эндпоинту, breaking-изменений нет.

## Открытые развилки (не блокируют propose)

- URL раздела и его подпись в навигации/на корневой странице в запросе не зафиксированы — решается на фазе plan по аналогии с `/cron`.

```yaml
# cow-result
status: утверждение
blocker: { category: нет, message: "" }
size: normal
complexity: { implementation: обычная, review: обычная }
skip_specs: false
```
