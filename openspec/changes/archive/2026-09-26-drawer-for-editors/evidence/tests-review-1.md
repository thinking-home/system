## Блокирующие находки

Нет.

## Неблокирующие находки

1. `ThinkingHome.Tests/Plugins.WebServer/HomePluginsMiddlewareTests.cs:53` — имя метода `Invoke_CallsRegisteredHandler_AndReturnsItsResult` не строго следует шаблону `Действие_Результат_WhenУсловие` из `testing.md` (нет части `When...`), но `DisplayName` точно воспроизводит цепочку capability › требование › сценарий, а правило именования метода помечено как факультативное («при желании»). Не блокирует.

## Disposition пунктов верификатора

Не применимо: фаза `tests_review`, `verificationReport` в пакете отсутствует.

## Проверка соответствия

- `plugins/web-server/http-resources` (4 сценария в `specs/plugins/web-server/http-resources/spec.md`) — все покрыты unit-тестами в `HomePluginsMiddlewareTests.cs`, один тест на сценарий, тексты `DisplayName` дословно совпадают со сценариями спецификации:
  - «Запрос динамического ресурса вызывает обработчик» → `Invoke_CallsRegisteredHandler_AndReturnsItsResult` — проверяет вызов обработчика и возврат его результата, без побочной логики.
  - «Некэшируемый динамический ресурс» → `Invoke_SetsNoCacheHeader_WhenHandlerIsNotCached` — проверяет заголовок `Cache-Control: no-cache, no-store` на двух запросах подряд и рост счётчика вызовов.
  - «Кэшируемый ресурс с разными параметрами строки запроса» → `Invoke_CallsHandlerForNewQueryString_WhenCachedResourceRequestedWithDifferentParams` — `?id=A` затем `?id=B`, оба ответа разные и обработчик вызван дважды. Соответствует сценарию дословно.
  - «Повторный запрос с той же строкой запроса» → `Invoke_CallsHandlerOnce_WhenSameQueryStringRequestedTwice` — два одинаковых запроса, обработчик вызван один раз, ответы совпадают.
  - Тесты используют реальные `ObjectRegistry`, `MemoryCache`, `DefaultHttpContext` и тестовый `CountingHandler` (без моков продуктовой логики), не привязаны к деталям реализации (например, к точной формуле ключа кэша) — проверяют наблюдаемое поведение через HTTP-контракт. Тест 3 и тест 4 на текущей (ещё не изменённой) реализации `HomePluginsMiddleware.cs:43` ожидаемо провалятся, потому что ключ кэша сейчас не включает `QueryString` (задача 2.1 в `tasks.md` ещё не выполнена) — это корректно для фазы `tests_review`: тесты написаны до реализации и фиксируют требуемое поведение.
  - `ThinkingHome.Tests/ThinkingHome.Tests.csproj` дополнен минимальным `ProjectReference` на `ThinkingHome.Plugins.WebServer`, как и требует `testing.md` («для тестов другого плагина добавьте ProjectReference»). Проект тестов собирается без ошибок (`dotnet build ThinkingHome.Tests/ThinkingHome.Tests.csproj` — Build succeeded).
- `plugins/cron/web-ui` (5 сценариев) и `plugins/scripts/web-ui` (4 сценария) — все сценарии из дельт спецификаций присутствуют в `coverage.yaml` с пометкой `manual` и обоснованием, дословно совпадающим с `testing.md` («тест-раннера для каталогов `ThinkingHome.Plugins.*/frontend/**` нет, скриптов `test` в `package.json` нет») и `design.md` («Стратегия проверки»). Обоснование корректно: инфраструктуры для TS-тестов в проекте действительно нет. Ручные шаги детализированы в `test-plan.md` один в один с формулировками сценариев, включая дымовой обход остальных разделов после обновления `@thinking-home/ui` (пункт чеклиста «Беглый обход остальных разделов UI»), что закрывает требование дымового прогона при полностью ручном покрытии UI-модуля.
- Регрессий: удалений существующих тестов не обнаружено (диф затрагивает только новый файл тестов и один добавленный `ProjectReference`).
- Продуктовой логики в тестах нет: тестовый `CountingHandler` — минимальная заглушка `BaseHandler`, не дублирует логику кэширования из `HomePluginsMiddleware`.

## Вердикт

**готово** — тесты полностью и точно покрывают все added-утверждения из дельт спецификаций, ручные пометки обоснованы отсутствием инфраструктуры и зафиксированы в test-plan.md, продуктовой логики и хрупких привязок к реализации в тестах нет.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
findings:
  - { level: non-blocking, file: "ThinkingHome.Tests/Plugins.WebServer/HomePluginsMiddlewareTests.cs:53", text: "Имя метода теста не содержит части When-условия из факультативного правила именования testing.md; DisplayName точно совпадает со сценарием спецификации, не блокирует." }
```
