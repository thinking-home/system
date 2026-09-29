- Явно закреплена граница изменения: общая WebUi-оболочка и обработка `/favicon.ico` не входят в `design-fixes`; известный 404 считается внешним шумом browser-проверки.
- В `design.md` добавлено решение D7, в `tasks.md` — открытая задача 4.6 на проверку состава запечатанного change-set. Change-set содержит 14 файлов, не затрагивает favicon/WebUi-оболочку и не имеет drift.
- `sbox-contract validate --delta openspec/changes/design-fixes/specs --json` и `sbox validate --change design-fixes --json` завершились без диагностик.

```yaml
# sbox-result
status: готово
blocker: { category: нет, artifact: "", message: "" }
questions: []
```
