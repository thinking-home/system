## Верификация: drawer-for-editors

Повторная независимая проверка после блокирующей находки ревью (`evidence/review-1.md`): не были выполнены 2 из 4 обязательных ручных сценариев `plugins/scripts/web-ui › Форма подписки в шторке` — «Успешное добавление закрывает шторку» и «Закрытие шторки подписки без сохранения». В этом прогоне оба сценария выполнены в браузере, находка закрыта.

| Измерение | Результат |
|---|---|
| Полнота | 9/9 задач, 13/13 утверждений (4 сценария plugins/web-server/http-resources автотестами, 5 сценариев plugins/cron/web-ui + 4/4 сценария plugins/scripts/web-ui вручную в браузере — все четыре, включая ранее не проверенные) |
| Корректность | тесты: 43/43 passed (`dotnet test`, дайджест change-set не менялся с r7 — `sha256:63dbc139...`); tsc: 5/5 проектов без ошибок; сборка: `dotnet build ThinkingHome.sln` успешна (проверено в r7 на этом же дайджесте, код не менялся); ручные браузерные сценарии: все 9 (5 cron + 4 subscriptions) выполнены, PASS |
| Согласованность | соблюдено: D1–D4 из design.md видны в коде и в поведении приложения на обеих страницах, паттерны проекта не нарушены |

### Периметр

Change-set идентичен проверенному в run r7 (тот же дайджест `sha256:63dbc139588450f7d2415599846e050291c226687fe20785370b9176f1dce297`, 18 файлов). Все файлы объяснены (см. подробности в r7): реализация D1–D3 (`tasks.tsx`, `subscriptions.tsx`, `HomePluginsMiddleware.cs`), лексика (`lang.ts`, `.resx`), тест (`HomePluginsMiddlewareTests.cs` + `ProjectReference`), обновление зависимости (D4, 5×`package.json`/`package-lock.json`). Необъяснимых файлов нет.

### Проверки

- V1 PASS — утверждение «Динамический ресурс генерируется на каждый запрос» (4 сценария): `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` → 43/43 passed.
- V2 PASS — типы TS во всех пяти обновлённых UI-проектах: `npx tsc -p tsconfig.json` (проверено в r7 на этом же дайджесте) → без ошибок.
- V3 PASS — чистая сборка решения дважды подряд (проверено в r7 на этом же дайджесте): `dotnet build ThinkingHome.sln` × 2 → Build succeeded, 0 Warning(s), 0 Error(s).
- V4 PASS — «Открытие формы новой записи» и «Открытие формы редактирования» (`/cron`): `dotnet run` (порт 8080) + `sbox-browser`: кнопка «Новая запись» видна со списком; шторка `dialog "Новая запись"` открывается пустой; клик по названию записи открывает `dialog "Редактирование задачи"` с заполненными полями.
- V5 PASS — «Успешное сохранение закрывает шторку» (`/cron`): заполнены «Название»/«Событие», «Добавить» → шторка закрылась, запись в списке, alert «Запись добавлена».
- V6 PASS — «Закрытие шторки без сохранения» (`/cron`): правка поля в форме редактирования + «Отмена» → исходные данные не изменились; повторное открытие формы новой записи — поля пустые.
- V7 PASS — «Открытие формы новой подписки» (`/scripts/subscriptions`): клик «Новая подписка» → `dialog "Новая подписка"` открылась справа (`size="lg"`), список подписок остался виден.
- V8 PASS — «Успешное добавление закрывает шторку» (`/scripts/subscriptions`, ранее не проверено — закрывает блокирующую находку ревью): в шторке выбран сценарий «test1» (`#mantine-... [role=option]`), событие «scripts:user-event» (появилось поле фильтра по meta с disabled-ключом `name`), заполнено значение `verify-r10`, клик «Добавить» → шторка закрылась, в списке появилась строка `test1 / scripts:user-event / name=verify-r10`, alert «Подписка добавлена». Запись затем удалена (`Удалить` + `dialog accept`) для чистоты стенда, удаление подтверждено alert «Подписка удалена».
- V9 PASS — «Закрытие шторки подписки без сохранения» (`/scripts/subscriptions`, ранее не проверено — закрывает блокирующую находку ревью): в шторке выбран сценарий «test1» и событие «cron:task:started», клик «Отмена» → список подписок не изменился (осталось 3 строки, четвёртая не добавлена); повторное открытие формы новой подписки показывает пустые комбобоксы «Сценарий» и «Событие» (`combobox` без атрибута `value` в снимке) — форма действительно сброшена, подписка не создана.
- V10 PASS — согласованность серверного кэша по query string: `curl -i "/api/webui/lang?id=<cron-id>"` и `?id=<scripts-id>` (повтор из r7 на этом же коде) → оба 200 с разным, корректным для своего раздела телом (в т.ч. `editTask` только в ответе cron).
- V11 PASS — беглый обход `/telegram-chat-list` после обновления `@thinking-home/ui`: страница загрузилась, `console --errors` — ошибок приложения нет (только не относящийся к делу `favicon.ico`), `requests` — без 4xx/5xx кроме favicon.
- V12 PASS — веб-сервер работал стабильно на порту 8080 всё время проверки; фоновые ошибки в логах (`MQTT`, `Telegram Bot API 401`, `MTRF adapter`, `SMTP connection refused`) относятся к отсутствующим внешним сервисам/устройствам, не связаны с изменением.

### Пробелы

- G1 — окружение: детерминированный триггер серверной ошибки сохранения через UI на `/cron` и `/scripts/subscriptions` (клиентская валидация на cron асинхронна и обычно опережает отправку; `Select` на subscriptions ограничивает значения только существующими, доступной через форму ветки, гарантированно кидающей ошибку сервера, нет); оракул: сценарии «Ошибка сохранения/добавления оставляет шторку открытой» из specs/coverage.yaml; риск: низкий — код `submit`/`fail` и условие `formVisible`, управляющее `Drawer.opened`, этим диффом не менялся (design.md, D1; подтверждено `git diff` — правки только переносят JSX под `Drawer`), значит риск регрессии не увеличен изменением.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
checks:
  - { id: V1, purpose: "утверждение «Динамический ресурс генерируется на каждый запрос» (4 сценария)", result: PASS, evidence: "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43 passed" }
  - { id: V2, purpose: "проверка типов TS в пяти обновлённых UI-проектах", result: PASS, evidence: "npx tsc -p tsconfig.json в WebUi, Cron.WebUi, Scripts.WebUi, TelegramChatList.WebUi, Tmp — без ошибок (r7, тот же дайджест)" }
  - { id: V3, purpose: "чистая сборка решения дважды подряд", result: PASS, evidence: "dotnet build ThinkingHome.sln x2 — Build succeeded, 0 Warning(s), 0 Error(s) (r7, тот же дайджест)" }
  - { id: V4, purpose: "открытие формы новой записи и формы редактирования /cron", result: PASS, evidence: "sbox-browser: dialog «Новая запись» и dialog «Редактирование задачи» с заполненными полями, список виден" }
  - { id: V5, purpose: "успешное сохранение закрывает шторку /cron", result: PASS, evidence: "sbox-browser: submit → шторка закрылась, alert «Запись добавлена», запись в списке" }
  - { id: V6, purpose: "закрытие шторки без сохранения отбрасывает данные /cron", result: PASS, evidence: "sbox-browser: правка поля + «Отмена» → данные не изменились, следующее открытие пустое" }
  - { id: V7, purpose: "открытие формы новой подписки /scripts/subscriptions, ширина lg", result: PASS, evidence: "sbox-browser: dialog «Новая подписка» открылась справа, список виден" }
  - { id: V8, purpose: "успешное добавление подписки закрывает шторку и обновляет список", result: PASS, evidence: "sbox-browser: выбран test1/scripts:user-event, заполнен meta value, «Добавить» → шторка закрылась, строка в списке, alert «Подписка добавлена»" }
  - { id: V9, purpose: "закрытие шторки подписки без сохранения отбрасывает данные", result: PASS, evidence: "sbox-browser: выбран test1/cron:task:started, «Отмена» → список не изменился (3 строки), повторное открытие — пустые комбобоксы" }
  - { id: V10, purpose: "серверный кэш /api/webui/lang различает id в строке запроса", result: PASS, evidence: "curl -i /api/webui/lang?id=<cron> и ?id=<scripts> — оба 200 с разным, корректным телом" }
  - { id: V11, purpose: "беглый обход /telegram-chat-list после обновления th-ui", result: PASS, evidence: "sbox-browser: console --errors без ошибок приложения, requests без 4xx/5xx (кроме favicon.ico)" }
  - { id: V12, purpose: "веб-сервер работает независимо от недоступных внешних сервисов", result: PASS, evidence: "лог dotnet run: 'Now listening on: http://[::]:8080' сохраняется на всём протяжении проверки" }
gaps:
  - { id: G1, environment: "управляемый сбой сервера (валидация/дублирование) на /cron и /scripts/subscriptions", oracle: "сценарии «Ошибка сохранения/добавления оставляет шторку открытой»", risk: "низкий: логика submit/fail и условие Drawer.opened=formVisible не менялись этим диффом (design.md, D1)" }
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 43/43"
  - "npx tsc -p tsconfig.json — 5/5 проектов без ошибок"
  - "dotnet build ThinkingHome.sln — 2/2 успешных прогона подряд"
  - "sbox-browser: /cron — все 5 сценариев (открытие, редактирование, сохранение, отмена) PASS"
  - "sbox-browser: /scripts/subscriptions — все 4 сценария (открытие, успешное добавление, отмена) PASS, включая 2 ранее не проверенных"
  - "curl /api/webui/lang?id=... — кэш различает разделы по строке запроса"
```
