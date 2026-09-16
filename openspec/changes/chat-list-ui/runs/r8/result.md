# Результат — tester / cover (r8)

## Что сделано

Пункт 2 замечания владельца (четыре неблокирующих находки ревьюера) выполнен в
`openspec/changes/chat-list-ui/test-plan.md` — это единственная часть возврата, которая попадает
в полномочия роли (`coverage.yaml`, `test-plan.md`, тестовые файлы):

- проверка 1 «Раздел использует HTTP API списка чатов» — добавлен статический шаг: прочитать
  `ThinkingHome.Plugins.TelegramChatList.WebUi.csproj` и убедиться, что `ProjectReference` ровно три
  (`Core.Plugins`, `WebServer`, `WebUi`), ссылок на `ThinkingHome.Plugins.Database` и на доменный плагин
  `ThinkingHome.Plugins.TelegramChatList` нет (`design.md`, D1); оговорено, что в браузере это не наблюдаемо;
- проверка 4 «Список отсортирован по убыванию даты» — главным оракулом стало убывание `date`
  (`alpha` → `bravo` → запись с `chatId = 1004` → `charlie`), порядок записей в ответе API переведён
  в дополнительное наблюдение, которое само по себе проверку не проваливает;
- проверка 8 «Запрос списка чатов завершился ошибкой» — след ошибки ищется в консоли браузера
  (строка вида `<ISO-время> ERROR /TELEGRAM-CHAT-LIST: <сообщение>`), а не в логе приложения; указано,
  почему: логгер оболочки собран с единственным приёмником `ConsoleLogDestination`
  (`ThinkingHome.Plugins.WebUi/frontend/index.tsx:30-31`, `frontend/utils/logger.ts:25-42`), namespace —
  `pathname` в верхнем регистре (`frontend/components/Application.tsx:54`);
- проверка 10 «Раздел на русском языке» — добавлен второй прогон при `culture: en-US` (или без ключа
  `culture`) с ожиданием английских текстов кейсета — это закрывает клаузу требования «язык текстов
  по умолчанию — английский».

Автотесты не добавлялись и `coverage.yaml` не переписывался — см. блокер.

## Почему заблокировано

Пункт 1 замечания владельца («порядок вывода задаём на сервере: захардкодить сортировку по дате
по убыванию в HTTP API списка чатов») прямо противоречит действующим артефактам планирования,
а править их роль tester не может (`authority` пакета: только `coverage.yaml`, `test-plan.md`,
тестовые файлы; правило роли: «не меняй артефакты планирования и истину спецификаций»):

- `specs/plugins/telegram-chat-list/web-ui/spec.md:27` — «Порядок SHALL обеспечиваться самим разделом
  и SHALL не зависеть от порядка записей в ответе API»; сценарий на строках 29–32 сформулирован
  как «в ответе API записи идут в произвольном порядке»;
- дельты к capability `plugins/telegram-chat-list/http-api` в изменении нет вовсе — при решении владельца
  именно эта capability меняет поведение (истина: `openspec/specs/plugins/telegram-chat-list/http-api/spec.md`,
  требование «Список сохранённых чатов» порядок записей не задаёт);
- `design.md`, D3 (строки 118–124) и схема потока данных (строка 40) фиксируют сортировку на клиенте,
  а «Контракты › HTTP (без изменений)» (строка 47) — что контракт API не меняется;
- `proposal.md:10, 21, 36, 40` — «порядок обеспечивается самим разделом», «изменение HTTP API… не входит»,
  «изменяемых capability нет»;
- `tasks.md`, задача 3.5 — «сортировать полученный список по убыванию `date` на клиенте».

Пока эти артефакты не приведены к решению владельца, `coverage.yaml` заполнить нечем: его ключи —
дословные имена требований и сценариев дельт (`cow instructions coverage`), а нужные утверждения
(«порядок задаёт HTTP API») в дельтах отсутствуют. Писать тесты и ручные проверки против утверждения,
которое говорит обратное решению владельца, нельзя.

## Что нужно изменить на фазе plan (для следующего прогона)

1. `specs/` — добавить дельту `specs/plugins/telegram-chat-list/http-api/spec.md` с секцией MODIFIED
   для требования «Список сохранённых чатов» (или отдельным требованием о порядке записей) и сценарием
   вида «записи возвращаются по убыванию `date`»; в дельте `…/web-ui/spec.md` переформулировать требование
   «Порядок вывода чатов»: раздел выводит записи в порядке ответа API, собственной сортировки и средств
   изменить порядок не имеет.
2. `design.md` — переписать D3 (сортировка в `TelegramChatListWebApiPlugin.GetChatList`:
   `db.Set<Chat>().OrderByDescending(x => x.Date)`, файл
   `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs:18-23`), поправить схему
   потока данных (строка 40), раздел «Контракты › HTTP» (строка 47) и «Стратегию проверки».
3. `proposal.md` — «Входит»/«Не входит», список изменяемых функциональностей (добавить
   `plugins/telegram-chat-list/http-api`) и «Внешнее влияние» (контракт API получает гарантию порядка).
4. `tasks.md` — снять задачу 3.5 (клиентская сортировка), добавить задачу на `OrderByDescending` в плагине
   `TelegramChatList.WebApi` и на README этого плагина.

Замечание по тестируемости для планировщика (не решение роли): перенос сортировки на сервер сам по себе
автотест не открывает — обработчик приватный, требует `DatabasePlugin.OpenSession()` и реального PostgreSQL,
уровень «component (C#, плагин с зависимостями)» в `.cow/project/testing.md` помечен «—», а
`ThinkingHome.Tests/ThinkingHome.Tests.csproj` не ссылается на `…TelegramChatList.WebApi`. Уровень unit
стал бы применим, только если дизайн выделит сортировку в чистый метод над последовательностью записей;
иначе утверждение останется `manual` с проверкой ответа API в браузере (это дешевле и надёжнее, чем сейчас:
порядок будет наблюдаем прямо в ответе `/api/telegram-chat-list/web-api/list`).

## Проверено

- `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj` — 39 тестов, все зелёные (регрессия не тронута,
  новых автотестов по дельте нет).
- `cow validate --change chat-list-ui --json` — `valid: true`, диагностик нет.
- Факты для правок test-plan проверены по коду: `ConsoleLogDestination` — единственный приёмник логгера
  (`ThinkingHome.Plugins.WebUi/frontend/index.tsx:30-31`), формат строки и namespace — `frontend/utils/logger.ts:25-42`
  и `frontend/components/Application.tsx:54`; состав `ProjectReference` UI-плагина — по образцу
  `ThinkingHome.Plugins.Cron.WebUi.csproj`; отсутствие `OrderBy` в текущем API —
  `ThinkingHome.Plugins.TelegramChatList.WebApi/TelegramChatListWebApiPlugin.cs:18-23`.

```yaml
# cow-result
status: заблокировано
blocker: { category: артефакт, artifact: specs, message: "Решение владельца «сортировку по убыванию date хардкодим в HTTP API списка чатов» противоречит действующим дельтам и дизайну: specs/.../web-ui/spec.md:27 требует, чтобы порядок обеспечивал сам раздел, дельты к plugins/telegram-chat-list/http-api нет, design.md D3 и proposal.md:10,21 фиксируют клиентскую сортировку и неизменность контракта API, tasks.md 3.5 предписывает сортировать на клиенте. Правка proposal, дельт specs, design и tasks вне полномочий роли tester — нужен возврат на фазу plan; после неё coverage.yaml и test-plan.md будут переписаны под новые утверждения. Пункт 2 возврата (четыре замечания ревьюера) в test-plan.md уже выполнен." }
protected:
  - "openspec/changes/chat-list-ui/test-plan.md"
  - "openspec/changes/chat-list-ui/coverage.yaml"
verified:
  - "dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj — 39 регрессионных тестов зелёные, новых автотестов нет (все утверждения дельты — manual по testing.md)"
  - "cow validate --change chat-list-ui --json — valid: true, диагностик нет"
```
