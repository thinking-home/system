# Результат: planner, фаза plan, run r3

- Дельты спецификаций: новая capability `plugins/telegram-chat-list/web-ui` (раздел `/telegram-chat-list`: все поля записи, порядок из API, только просмотр, прочерки для `null`, сообщение о пустом списке, уведомление об ошибке загрузки); `MODIFIED` в `plugins/telegram-chat-list/http-api` (фиксированный порядок по `date` убыв., оба прежних сценария сохранены); `ADDED` в `plugins/web-ui/application-shell` (ссылка на раздел с корневой страницы).
- `design.md`: образец — `ThinkingHome.Plugins.Cron.WebUi`, перечислены все места подключения (`ThinkingHome.sln`, `ThinkingHome.Console.csproj`, `appsettings.json`, `README.md`, `Application.tsx`) с задачами и исключения (`ThinkingHome.Tests`, `.cow/project/architecture.md`); решения D1–D4; вопросы Q1 (P1) и Q2 (P2), блокирующих P0 нет.
- `tasks.md`: 6 групп — сортировка в API, каркас проекта, клиентская часть, локализация, подключение модуля, проверки (`dotnet test`, `npx tsc`, `dotnet build` дважды).
- `cow validate --change chat-list-ui-c --json`: `valid: true`, ошибок и предупреждений нет.

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
questions:
  - { id: Q1, priority: P1, text: "Адрес раздела и подпись ссылки на главной: рекомендация — /telegram-chat-list и «Telegram chats» (по соглашению /{plugin}); альтернатива — короткий /chats" }
  - { id: Q2, priority: P2, text: "Формат даты в таблице и нужен ли столбец id: рекомендация — локальный формат браузера, id последним столбцом" }
```
