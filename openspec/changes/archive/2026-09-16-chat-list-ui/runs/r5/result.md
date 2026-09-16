# Результат — planner / plan (r5, возврат по замечаниям гейта)

## Сводка

- **Замечание 1 (пустой список).** Требование усилено и сделано проверяемым: в дельте `openspec/changes/chat-list-ui/specs/plugins/telegram-chat-list/web-ui/spec.md` появилось требование «Состояние пустого списка чатов» (заголовок раздела остаётся, на месте списка — сообщение «чатов пока нет», пустой список со строкой заголовков колонок не отображается, пустая область без пояснения не остаётся) с двумя сценариями; сообщение добавлено в требование «Локализация раздела списка чатов» (ключ `emptyList`, английский по умолчанию + русский перевод). В `design.md` добавлено решение D5 «Состояние пустого списка: сообщение вместо таблицы» (приём повторяет `Cron.WebUi`: `{list.length ? <Table…/> : <Text>{t('emptyList')}</Text>}`), состояния раздела описаны в «Общей картине» и «Структуре UI». В `tasks.md` задача 3.8 переписана под это состояние, в 2.3 и 3.2 зафиксированы тексты ключа. В `proposal.md` состояние пустого списка вынесено в «Входит».
- **Замечание 2 (правила URL).** Правила проверены по первоисточникам и разбор занесён в решение D2 таблицей: `ThinkingHome.Plugins.WebServer.UrlValidation/README.md` («Правила формирования URL»), `openspec/specs/plugins/web-server/url-validation/spec.md`, `.cow/project/glossary.md` (plugin alias), `.cow/project/conventions.md` («Именование» → «Разделы UI: `/{plugin}` и `/{plugin}/{page}`», «Запрещено» → схемы `/api/…`, `/dynamic/….ext`, `/static/….ext`, `/vendor/…`) и фактические адреса разделов в коде. Итог: alias доменного пакета — `telegram-chat-list`, alias пакета раздела — `telegram-chat-list/web-ui`; правило разделов UI использует alias доменного пакета (пример из conventions `/scripts/edit` для `Scripts.WebUi`, в коде `/cron` у `Cron.WebUi`, а не `/cron/web-ui`), поэтому у пакета с единственным разделом адрес — `/telegram-chat-list`. Схемы `/api/…`, `/dynamic/…`, `/static/…` к адресу раздела не применяются: раздел не регистрирует HTTP-ресурсов сам — документ раздела и бандл регистрирует `WebUiPlugin` (alias `web-ui`), из-за чего любой адрес раздела попадает в `/dynamic/web-server/url-validation/errors.txt` так же, как существующие `/cron`, `/scripts`, `/page1` (в коде `WebUiPlugin` стоит `// TODO: подумать про пути к корневой странице + валидацию путей`). Это зафиксировано в «Рисках» вместе с мерой: сравнить отчёт до и после — новых видов ошибок быть не должно. Остаточная развилка (трактовка `{plugin}`) вынесена в Q1 с вариантами `/telegram-chat-list` (рекомендуется), `/telegram-chat-list/chats`, `/telegram-chat-list/web-ui`.
- Решения перенумерованы (D1–D10), ссылки в `tasks.md` обновлены; `cow validate --change chat-list-ui --json` → `valid: true`, из диагностики только info «Артефакт test-plan ждёт: coverage».

## Открытые вопросы

| ID | Приоритет | Вопрос | Рекомендация (применена в артефактах) |
|---|---|---|---|
| Q1 | P1 | Трактовка `{plugin}` в правиле «Разделы UI: `/{plugin}`» для пакета `TelegramChatList.WebUi`: `/telegram-chat-list`, `/telegram-chat-list/chats` или `/telegram-chat-list/web-ui` | `/telegram-chat-list` — alias доменного пакета, как `/cron` и `/scripts` |
| Q2 | P1 | Где фиксировать требование «ссылка на раздел есть на корневой странице»: содержимое корневой страницы не описано ни одной capability | В новой capability `plugins/telegram-chat-list/web-ui`; истина `plugins/web-ui/application-shell` не меняется |
| Q3 | P2 | Формат показа поля `date`: по языку интерфейса или ISO-строкой как от API | Форматировать по языку интерфейса (`lang` из контекста) |
| Q4 | P2 | Ошибка загрузки: уведомление как в Cron.WebUi/Scripts.WebUi или собственный экран ошибки | Уведомление `toaster.showError` и запись в лог, таблица не отображается |

```yaml
# cow-result
status: готово
blocker: { category: нет, message: "" }
questions:
  - { id: Q1, priority: P1, text: "Адрес раздела: /telegram-chat-list (alias доменного пакета, как /cron и /scripts — применено), /telegram-chat-list/chats (форма /{plugin}/{page}) или /telegram-chat-list/web-ui (буквальный alias пакета раздела)" }
  - { id: Q2, priority: P1, text: "Где фиксировать требование о ссылке на раздел на корневой странице: в новой capability plugins/telegram-chat-list/web-ui (применено), дельтой к plugins/web-ui/application-shell или не фиксировать" }
  - { id: Q3, priority: P2, text: "Формат показа поля date: по языку интерфейса (применено) или ISO-строкой как от API" }
  - { id: Q4, priority: P2, text: "Ошибка загрузки: уведомление toaster как в остальных разделах (применено) или собственный экран ошибки в разделе" }
```
