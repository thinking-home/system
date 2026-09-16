# Результат — researcher, chat-list-ui, run r1

Evidence Pack записан в `openspec/changes/chat-list-ui/evidence/research.md`.

## Резюме

1. **Данные уже есть, нужен только раздел.** `/api/telegram-chat-list/web-api/list` (`ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs`) без параметров возвращает все поля таблицы `TelegramChatList_Chat` — `id`, `login`, `chatId`, `firstName`, `lastName`, `date`; это зафиксировано capability `plugins/telegram-chat-list/http-api`. UI-проекта для плагина нет.
2. **Есть точный образец UI-плагина** — `ThinkingHome.Plugins.Cron.WebUi` (`CronWebUiPlugin.cs` с `[ConfigureWebUi]` и `RegisterPage`, `.csproj` с таргетами `NpmInstall`/`BuildClient*`, `package.json` с `thPlugin.entries` и `th-build`, `frontend/api.ts` + `lang.ts` + страница с `createModule`, `Lang/*.resx`). Коммит `69745f3` показывает полный набор правок при добавлении такого плагина.
3. **«Главная» — это захардкоженный компонент `Home`** в `ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:25-47`: список ссылок задан в коде (`/scripts`, `/cron`, `/page1…3`), тексты не локализованы. Ссылка на новый раздел добавляется туда же, что потребует пересборки бандла оболочки WebUi.
4. **Спецификации:** раздел списка чатов не описан ни одной capability (кандидат на новую `plugins/telegram-chat-list/web-ui` по образцу `plugins/cron/web-ui`); содержимое корневой страницы не описано ни одним требованием — `plugins/web-ui/application-shell` покрывает только переход на корневую страницу из навигации.
5. **Проверки:** автотестов для chat list и веб-интерфейса нет (`ThinkingHome.Tests` покрывает только Core.Plugins, Scripts, TelegramBot), тест-раннера для `frontend/**` нет. Остаются `dotnet build ThinkingHome.sln` (дважды при чистой сборке), `npx tsc -p tsconfig.json` в новом UI-проекте, регрессия `dotnet test` и ручная проверка в браузере + `/dynamic/web-server/url-validation/errors.txt`.

Пробелы (не блокирующие, решаются на планировании): фиксировать ли требование о ссылке на главной в спецификациях и в какой capability; URL раздела и имя бандла заданы только соглашениями (`/telegram-chat-list`, ключ `thPlugin.entries`); формат вывода полей (`id`, `date`, `null`) в запросе не оговорён.

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
```
