## 1. Обновление @thinking-home/ui

- [x] 1.1 Поднять `@thinking-home/ui` до `^0.13.0` в `package.json` и `package-lock.json` (через `npm install`) проектов `ThinkingHome.Plugins.WebUi`, `ThinkingHome.Plugins.Cron.WebUi`, `ThinkingHome.Plugins.Scripts.WebUi`, `ThinkingHome.Plugins.TelegramChatList.WebUi`, `ThinkingHome.Plugins.Tmp` (техническая, D4)
- [x] 1.2 Исправить ошибки компиляции TS из-за изменений API th-ui, если `npx tsc` их покажет (техническая, D4)

## 2. Кэш динамических ресурсов

- [x] 2.1 В `ThinkingHome.Plugins.WebServer/HomePluginsMiddleware.cs` включить `context.Request.QueryString` в ключ серверного кэша (plugins/web-server/http-resources › Динамический ресурс генерируется на каждый запрос, D3)

## 3. Форма записи расписания в шторке

- [x] 3.1 В `ThinkingHome.Plugins.Cron.WebUi/frontend/tasks.tsx` перенести поля формы в `Drawer` (`position="right"`, `opened={formVisible}`, `onClose={resetForm}`), таблицу и кнопку `newTask` показывать всегда (plugins/cron/web-ui › Форма записи расписания в шторке, D1, D2)
- [x] 3.2 Заголовок шторки: `t('newTask')` при добавлении, `t('editTask')` при редактировании; добавить ключ `editTask` в `frontend/lang.ts`, `Lang/CronWebUiPlugin.resx` и `Lang/CronWebUiPlugin.ru-RU.resx` (plugins/cron/web-ui › Форма записи расписания в шторке)

## 4. Форма подписки в шторке

- [x] 4.1 В `ThinkingHome.Plugins.Scripts.WebUi/frontend/subscriptions.tsx` перенести поля формы в `Drawer` (`position="right"`, `size="lg"`, `opened={formVisible}`, `onClose={resetForm}`, заголовок `t('newSubscription')`), таблицу и кнопку `newSubscription` показывать всегда (plugins/scripts/web-ui › Форма подписки в шторке, D1, D2)

## 5. Проверки

- [x] 5.1 Прогнать тесты из coverage.yaml и все тесты: `dotnet test ThinkingHome.Tests/ThinkingHome.Tests.csproj`
- [x] 5.2 Проверить типы: `npx tsc -p tsconfig.json` в каждом из пяти UI-проектов из задачи 1.1
- [x] 5.3 Собрать решение: `dotnet build ThinkingHome.sln` дважды подряд, без ошибок
