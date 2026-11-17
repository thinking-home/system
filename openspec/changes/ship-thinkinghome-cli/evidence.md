# Проверка кандидата 5.0.0-alpha.1

Windows x64, .NET SDK 10.0.403. После объединения проектов и переименования команды в th проверены два архива из `artifacts/nuget/5.0.0-alpha.1/`:

| Архив | SHA-256 |
|---|---|
| ThinkingHome.Console.5.0.0-alpha.1.nupkg | `a15756aa04cfc126beff462c525061598ef23b8ff252524b4bfa425cbee99af8` |
| ThinkingHome.Plugins.Timer.5.0.0-alpha.1.nupkg | `42dc1fe8f19c58e2120d30ec4f1bcb6bbf490eca4bba0ac75e0390f161f5b06f` |

Сценарий `tools/cli-acceptance.py` завершился с кодом 0: установка tool с пустым кешем вне checkout, установка Timer по HTTP, сверка SHA-512 lock, восстановление в другой каталог, проверка без сети, запуск и остановка хоста, удаление и проверка пустой установки. Проверка конечного deps.json подтверждает: из сборок ThinkingHome только Console ссылается на System.CommandLine. Источниками служили только каталог с CLI и локальный HTTP-сервер Timer. Новая ОС не разворачивалась.

Прошли 153 теста ThinkingHome.Packaging.Tests и 43 теста ThinkingHome.Tests. Команда `openspec validate ship-thinkinghome-cli --strict --json` вернула `valid: true`. Дельты подготовлены для доставки; внешняя публикация и установка с nuget.org не выполнялись.
