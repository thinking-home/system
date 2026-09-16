# Результат — planner / plan (r4)

## Сводка

- Написана дельта новой capability `plugins/telegram-chat-list/web-ui` (`openspec/changes/chat-list-ui/specs/plugins/telegram-chat-list/web-ui/spec.md`): 8 требований — зависимость от HTTP API списка чатов, раздел `/telegram-chat-list` со всеми полями записи и без действий над чатами, порядок по убыванию `date`, пустой список, `null`-поля, ошибка загрузки, переход с корневой страницы, локализация. Существующие capability (`http-api`, `chat-tracking`, `web-ui/*`) не затронуты.
- `design.md`: общая картина с путём пользователя и схемой потока данных, контракты (схема valibot ответа, регистрация раздела `RegisterPage("/telegram-chat-list", Bundle("chats.js"))`, ключи локализации, структура UI, поставка), девять решений D1–D9, соответствие соглашениям, риски, стратегия проверки и откат. Вопросов P0 нет — планирование реализации доведено до конца.
- `tasks.md`: 6 групп, 21 задача — каркас проекта `ThinkingHome.Plugins.TelegramChatList.WebUi`, серверная часть с `[ConfigureWebUi]` и `.resx`, клиентская часть (api/lang/компонент, сортировка, прочерки, формат даты, пустой список, ошибка), ссылка в `Home` оболочки, подключение к хосту и документация, проверки (`dotnet build` дважды, `npx tsc`, `dotnet test`).
- `cow validate --change chat-list-ui --json`: `valid: true`, из диагностики — только info о том, что `test-plan` ждёт `coverage`.

## Открытые вопросы

| ID | Приоритет | Вопрос | Рекомендация (применена в артефактах) |
|---|---|---|---|
| Q1 | P1 | Где фиксировать требование «ссылка на раздел есть на корневой странице»: содержимое корневой страницы не описано ни одной capability | В новой capability `plugins/telegram-chat-list/web-ui`; истина `plugins/web-ui/application-shell` не меняется |
| Q2 | P2 | Формат показа поля `date`: по языку интерфейса или ISO-строкой как от API | Форматировать по языку интерфейса (`lang` из контекста) |
| Q3 | P2 | Поведение при ошибке загрузки: уведомление как в Cron.WebUi/Scripts.WebUi или собственный экран ошибки | Уведомление `toaster.showError` и запись в лог, таблица не отображается |

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
questions:
  - { id: Q1, priority: P1, text: "Где фиксировать требование о ссылке на раздел на корневой странице: в новой capability plugins/telegram-chat-list/web-ui (применено), дельтой к plugins/web-ui/application-shell или не фиксировать" }
  - { id: Q2, priority: P2, text: "Формат показа поля date: по языку интерфейса (применено) или ISO-строкой как от API" }
  - { id: Q3, priority: P2, text: "Ошибка загрузки: уведомление toaster как в остальных разделах (применено) или собственный экран ошибки в разделе" }
```
