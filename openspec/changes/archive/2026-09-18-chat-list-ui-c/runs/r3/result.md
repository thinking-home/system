# Результат: planner / plan — chat-list-ui-c

## Сводка

- Записана дельта новой capability `plugins/telegram-chat-list/web-ui` (`openspec/changes/chat-list-ui-c/specs/plugins/telegram-chat-list/web-ui/spec.md`): 5 требований — зависимость от HTTP API, раздел со всеми полями без пагинации/фильтров, пустой список и ошибка загрузки, локализация, ссылка с корневой страницы.
- `design.md`: образец — read-only часть `ThinkingHome.Plugins.Cron.WebUi`, отступления (нет формы/CRUD, нет `models/`, урезанный keyset) с причинами; решения D1–D5 (отдельный проект `.WebUi`, URL `/telegram-chat-list` и entry `chats`, вывод полей без форматирования, разовая загрузка с `AbortController`, ошибки через `toaster`/`logger`).
- `tasks.md`: 5 групп — каркас проекта, серверная часть, клиентская часть, интеграция (`sln`, `assemblies`, ссылка в `Application.tsx`, README), проверки (`tsc`, двойная `dotnet build`, `dotnet test`).
- `cow validate` — ошибок нет (остался только info о заблокированном test-plan). Вопросов P0 нет, реализацию можно планировать.

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
questions:
  - { id: Q1, priority: P2, text: "Формат отображения поля date: строка ответа API как есть (рекомендация) или локальный формат даты и времени" }
  - { id: Q2, priority: P2, text: "Подпись раздела: «Telegram chats» / «Чаты Telegram» (рекомендация) или «Chat list» / «Список чатов»" }
```
