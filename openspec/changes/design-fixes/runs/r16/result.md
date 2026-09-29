- Проверен возврат verifier: `GET /favicon.ico` действительно возвращает 404 и фиксируется браузером как console error.
- Исправление не входит в утверждённые дельты `specs/`, `design.md` или 15 задач `tasks.md`; оно затрагивает общую оболочку WebUi, а не состояния списков текущего изменения. Реализация не менялась.

```yaml
# sbox-result
status: заблокировано
blocker:
  category: артефакт
  artifact: tasks
  message: "Исправление 404 /favicon.ico отсутствует в утверждённых specs, design.md и tasks.md; это изменение общей WebUi-оболочки расширяет согласованный объём design-fixes."
verified:
  - "evidence/verify-1.md — подтверждён GET /favicon.ico: 404"
  - "tasks.md — 15/15 задач выполнены, задачи favicon нет"
  - "archive/2026-09-26-drawer-for-editors/evidence/verify-2.md — favicon ранее явно исключался из ошибок затронутого UI"
```
