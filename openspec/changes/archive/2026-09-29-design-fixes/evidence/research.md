Evidence Pack записан в [evidence/research.md](/Users/dima117a/RiderProjects/thinking-home-system/evidence/research.md:1).

- Найдены четыре страницы со списками: `/scripts`, `/scripts/subscriptions`, `/cron`, `/telegram-chat-list`. При ошибке каждая оставляет `undefined` и рендерит `null`; пустой список выводится отдельным нецентрированным `<Text>`.
- В проекте только две шторки — для cron-задачи и подписки; их `Drawer.title` уже задан строкой и может быть увеличен стилем Mantine.
- Общая реализация не определена: UI-плагины независимы, а единственная общая зависимость `@thinking-home/ui@0.13.0` не содержит нужного компонента и её исходников нет в рабочем дереве.
- Браузерная проверка недоступна в текущей песочнице: `sbox-browser` не может создать лог за пределами разрешённой области.

```yaml
# sbox-result
status: заблокировано
blocker:
  category: пользователь
  message: "Где должен жить общий компонент состояний списка: нужно обновить и опубликовать внешний @thinking-home/ui, либо разрешается создать в этом репозитории общий UI-модуль и определить его сборку и импорт? Выбор меняет границы работ и поставку зависимости."
request:
  - quote: "нужно доработать веб-интерфейс плагинов: если на странице отображается список, то в случае ошибки нужно выводить заглушку (состояние ошибки), а в случае пустого списка нужно выводить пустое состояние."
    status: не проверено
    evidence: "openspec/changes/design-fixes/request.md; текущее поведение подтверждено в ThinkingHome.Plugins.{Scripts,Cron,TelegramChatList}.WebUi/frontend/{list,subscriptions,tasks,chats}.tsx"
  - quote: "сделай общий компонент для заглушки с серым текстом по центру и двумя вариациями (ошибка/пусто)."
    status: не проверено
    evidence: "openspec/changes/design-fixes/request.md; ThinkingHome.Plugins.WebUi/node_modules/@thinking-home/ui/dist/index.d.ts не экспортирует такой компонент"
  - quote: "также сделай заголовки во всех шторках крупнее (с помощью mantine стилей для заголовков)."
    status: не проверено
    evidence: "openspec/changes/design-fixes/request.md; шторки расположены в ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx:152 и ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:165"
  - quote: "Запиши правила для заголовков и состояний списков в проектную документацию (правила дизайна)"
    status: не проверено
    evidence: "openspec/changes/design-fixes/request.md; .sbox/project/conventions.md не содержит раздела правил дизайна"
```
