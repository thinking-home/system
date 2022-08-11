## Конфигурация

Найтройки приложения можно задать в файле `appsettings.json`. Если указано название окружения в переменной `THINKINGHOME_ENVIRONMENT`, то дополнительно будут подключены настройки из файла `appsettings.{THINKINGHOME_ENVIRONMENT}.json`

Вы можете передать дополнительные параметры конфигурации через [переменные окружения](https://docs.microsoft.com/ru-ru/dotnet/core/extensions/configuration-providers#environment-variable-configuration-provider) с префиксом `THINKINGHOME_`. В качестве иерархического разделителя используйте `__`.

Например, чтобы передать параметр `plugins:ThinkingHome.Plugins.Mail.MailPlugin:fromMail` укажите значение для переменной окружения `THINKINGHOME_plugins__ThinkingHome.Plugins.Mail.MailPlugin__fromMail`
