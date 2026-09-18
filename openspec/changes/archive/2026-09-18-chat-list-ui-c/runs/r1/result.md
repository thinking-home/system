# Результат — researcher (chat-list-ui-c, r1)

Evidence Pack записан в `openspec/changes/chat-list-ui-c/evidence/research.md`.

Краткое резюме:

- HTTP API для списка чатов уже существует и отдаёт все нужные поля (`ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`, `GET /api/telegram-chat-list/web-api/list`) — менять не требуется, только использовать.
- Раздела веб-интерфейса для чатов сейчас нет; ближайший и полностью применимый аналог — `ThinkingHome.Plugins.Cron.WebUi` (проект, регистрация раздела через `[ConfigureWebUi]`, компонент-таблица, `api.ts` на valibot, `lang.ts`+`.resx`). Для новой страницы нужна только read-only часть этого паттерна (без формы/CRUD).
- Ссылка на главную добавляется в хардкод-список `Home` в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:25-47`.
- Новый проект нужно зарегистрировать в `ThinkingHome.sln` и в `ThinkingHome.Console/appsettings.json:assemblies` (по образцу существующих записей `Cron.WebUi`/`TelegramChatList.WebApi`).
- Capability `plugins/telegram-chat-list/web-ui` в specsTruth отсутствует — потребуется добавить новую спецификацию-дельту по образцу `openspec/specs/plugins/cron/web-ui/spec.md`.
- Пробелы не блокируют исследование: точный URL/заголовок раздела не зафиксирован в request.md, решается на этапе планирования по аналогии с `/cron`.

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
```
