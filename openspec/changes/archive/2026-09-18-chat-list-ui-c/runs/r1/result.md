# Результат — researcher (chat-list-ui-c, r1)

Evidence Pack записан в `openspec/changes/chat-list-ui-c/evidence/research.md`.

Краткое резюме:

- HTTP API чатов уже есть (`ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`), но без
  сортировки — нужна дельта в `plugins/telegram-chat-list/http-api` и `OrderByDescending` по `date`.
- Раздела веб-интерфейса для чатов в коде нет; каталог `ThinkingHome.Plugins.TelegramChatList.WebUi/Resources/app/*`
  на диске — неотслеживаемый build-артефакт без исходников, не доказательство.
- Ближайший аналог — `ThinkingHome.Plugins.Cron.WebUi` (простой read-only/CRUD раздел-список); новый раздел проще
  (только read-only, все поля `Chat`, без форм и пагинации/фильтров).
- Ссылка на главной добавляется в `Home` внутри `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx`
  (демо-список, не спецификация).
- Регистрация нового модуля требует правок вне его каталога: `ThinkingHome.sln`,
  `ThinkingHome.Console/ThinkingHome.Console.csproj` (`ProjectReference`), `ThinkingHome.Console/appsettings.json`
  (`assemblies`), `README.md` (список плагинов) — не проверяется компиляцией.

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
```
