- Добавлены явные состояния `loading` / `ready` / `error` для списков Scripts, Cron и Telegram; ошибки скрывают устаревшие данные и сохраняют уведомления. Загрузка `/scripts/subscriptions` агрегирует три обязательных запроса в единый исход.
- В редакторе meta-фильтра появилось локализованное пустое состояние при сохранённой кнопке добавления. Заголовки шторок подписки и cron оформлены темовыми переменными Mantine для существующего `h2`.
- `/page2` теперь различает загрузку, непустой и пустой ответ, ошибку и явную отмену; добавлены ключи локализации, ресурсы и прямая зависимость `@mantine/core`. Обновлены проектные соглашения и отметки в `tasks.md`.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: tasks, message: "" }
verified:
  - "npx tsc -p tsconfig.json в Scripts.WebUi — ок"
  - "npx tsc -p tsconfig.json в Cron.WebUi — ок"
  - "npx tsc -p tsconfig.json в TelegramChatList.WebUi — ок"
  - "npx tsc -p tsconfig.json в Tmp — ок"
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43"
  - "dotnet build ThinkingHome.sln — 0 warnings, 0 errors"
  - "sbox-contract validate --delta openspec/changes/design-fixes/specs — ок"
  - "sbox validate --change design-fixes — ок"
  - "coverage.yaml: защищённых исполняемых файлов нет; UI-сценарии отмечены как ручные"
```
