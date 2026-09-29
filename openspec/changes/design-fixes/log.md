---
change: design-fixes
---

# Журнал — design-fixes

<!-- [TASK] событие | [CODE] факт о коде | [RULE] правило | [HUMAN] предпочтение -->
- [CODE] 2026-09-29 planner r4: Ранний evidence неполон: пятый верхнеуровневый асинхронный список находится в ThinkingHome.Plugins.Tmp/frontend/page2.tsx:18-36; данные загружаются из /api/tmp/pigs. Пустой ответ остаётся в состоянии LOADING, ошибка только логируется.
- [CODE] 2026-09-29 planner r4: Список сценариев: ThinkingHome.Plugins.Scripts.WebUi/frontend/list.tsx:15-79; источник /api/scripts/web-api/list задан в frontend/api.ts:64-65. Пустое и ошибочное состояния применимы.
- [CODE] 2026-09-29 planner r4: Список подписок: ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:30,53,251-293; источник /api/scripts/web-api/subscription/list задан в frontend/api.ts:79-80. Пустое и ошибочное состояния применимы.
- [CODE] 2026-09-29 planner r4: Список cron-задач: ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx:20,44,197-236; источник /api/cron/web-api/list задан в frontend/api.ts:51-52. Пустое и ошибочное состояния применимы.
- [CODE] 2026-09-29 planner r4: Список Telegram-чатов: ThinkingHome.Plugins.TelegramChatList.WebUi/frontend/chats.tsx:14-69; источник /api/telegram-chat-list/web-api/list задан в frontend/api.ts:17-18. Пустое и ошибочное состояния применимы.
- [CODE] 2026-09-29 planner r4: Статический список ссылок ThinkingHome.Plugins.WebUi/frontend/components/Application.tsx:25-48 фиксирован в JSX, не загружается и не бывает пустым; пустое и ошибочное состояния неприменимы.
- [CODE] 2026-09-29 planner r4: Наборы выбора сценариев и событий ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:173-187 являются данными Select, а не самостоятельными списками контента; ошибка их загрузки относится ко всей странице.
- [CODE] 2026-09-29 planner r4: Строки meta-фильтра ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:189-241 — локальная редактируемая коллекция, которая намеренно скрыта при отсутствии строк; пустое и ошибочное состояния неприменимы.
- [CODE] 2026-09-29 planner r4: Значения meta-фильтра ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx:277-282 — вложенная коллекция одной подписки; отсутствие фильтра допустимо и не требует пустого или ошибочного состояния.
- [HUMAN] 2026-09-29 planner r5: Редактируемый список строк meta-фильтра входит в design-fixes: при отсутствии строк показывается центрированное серое пустое состояние, кнопка добавления остаётся видимой и доступной; состояние ошибки к локальной коллекции не применяется.
- [CODE] 2026-09-29 planner r8: Mantine 9 Drawer оборачивает title в DrawerTitle, а ModalBaseTitle рендерит component=h2; вложенный Title order={2} создал бы h2 внутри h2. Источники: node_modules/@mantine/core/esm/components/Drawer/Drawer.mjs и ModalBase/ModalBaseTitle.mjs.
- [HUMAN] 2026-09-29 planner r8: Ответ на Q1: явная отмена загрузки /page2 показывает error-вариант заглушки с отдельным локализованным текстом «Загрузка отменена»; abort при размонтировании не отображает состояние.
