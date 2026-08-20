## Конфигурация

Найтройки приложения можно задать в файле `appsettings.json`. Если указано название окружения в переменной `THINKINGHOME_ENVIRONMENT`, то дополнительно будут подключены настройки из файла `appsettings.{THINKINGHOME_ENVIRONMENT}.json` (если такого файла нет, приложение запустится без него).

Файлы настроек приложение ищет в текущем рабочем каталоге процесса.

Вы можете передать дополнительные параметры конфигурации через [переменные окружения](https://docs.microsoft.com/ru-ru/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider) с префиксом `THINKINGHOME_`. В качестве иерархического разделителя используйте `__`.

Например, чтобы передать параметр `plugins:ThinkingHome.Plugins.Mail.MailPlugin:fromMail` укажите значение для переменной окружения `THINKINGHOME_plugins__ThinkingHome.Plugins.Mail.MailPlugin__fromMail`

## Локальный запуск

Настройки для локального запуска лежат в файле `appsettings.Development.json`. Он не хранится в git и при сборке копируется в выходную папку. Переменная окружения `THINKINGHOME_ENVIRONMENT=Development`, которая подключает этот файл, задана в профиле запуска `Properties/launchSettings.json`, поэтому отдельно её указывать не нужно.

Запускать приложение нужно из каталога, в котором лежат файлы настроек — из папки проекта:

```shell
cd ThinkingHome.Console
```

```shell
dotnet run
```

Настройки из `appsettings.Development.json` дополняют `appsettings.json` и заменяют значения с такими же ключами. Списки (например, `assemblies` или `authorizedLogins`) объединяются по индексам: заменить отдельные элементы списка можно, а сократить список нельзя — набор подключаемых плагинов задается только в `appsettings.json`.

В файлах настроек можно использовать комментарии — провайдер конфигурации их игнорирует.
