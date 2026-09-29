Evidence Pack обновлён в [evidence/research.md](/Users/dima117a/RiderProjects/thinking-home-system/evidence/research.md:1) с учётом ответа пользователя из r2.

- Блокер снят: общий компонент исключён из текущего объёма. Каждая из четырёх страниц собирает состояния из Mantine локально.
- Зафиксированы четыре затронутых списка, две существующие шторки, нужные capability и проверки TypeScript.
- Уточнено, что серверные API, маршруты и регистрация entry-бандлов для этой задачи не меняются.
- Единственное необязательное решение для планирования: использовать существующие локализованные `emptyList` и `errorLoad` или вводить отдельные тексты состояний.
- Браузерная проверка остаётся недоступной из-за запрета песочницы на создание лога `sbox-browser`.

```yaml
# sbox-result
status: готово
blocker:
  category: нет
  message: ""
request:
  - quote: "нужно доработать веб-интерфейс плагинов: если на странице отображается список, то в случае ошибки нужно выводить заглушку (состояние ошибки), а в случае пустого списка нужно выводить пустое состояние."
    status: не проверено
    evidence: "openspec/changes/design-fixes/request.md; текущее поведение подтверждено в ThinkingHome.Plugins.{Scripts,Cron,TelegramChatList}.WebUi/frontend/{list,subscriptions,tasks,chats}.tsx"
  - quote: "сделай общий компонент для заглушки с серым текстом по центру и двумя вариациями (ошибка/пусто)."
    status: противоречит
    evidence: "openspec/changes/design-fixes/runs/r2/packet.json, feedback: пользователь отменил общий компонент для этого изменения и предписал локальную сборку состояний из Mantine"
  - quote: "также сделай заголовки во всех шторках крупнее (с помощью mantine стилей для заголовков)."
    status: не проверено
    evidence: "ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx:152-157 и ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:165-171"
  - quote: "Запиши правила для заголовков и состояний списков в проектную документацию (правила дизайна)"
    status: не проверено
    evidence: ".sbox/project/conventions.md не содержит раздела правил дизайна"
```
