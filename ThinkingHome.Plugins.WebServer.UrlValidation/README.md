*ThinkingHome.Plugins.WebServer.UrlValidation* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebServer.UrlValidation.svg)]()

# UrlValidationPlugin

Проверяет соответствие URL http-ресурсов подключенных плагинов правилам формирования URL. Список найденных ошибок доступен в веб-интерфейсе по адресу `/api/web-server/url-validation/errors`. 

## Правила формирования URL

### Plugin alias

В адресах используется значение `plugin alias` - это имя пакета, без префикса `ThinkingHome.Plugins.`, вместо точек разделитель - слэш `/`, в нижнем регистре.

`ThinkingHome.Plugins.MyPlugin.InnerPackage` => `myplugin/innerpackage`

### Методы API

`/api/{pluginAlias}/{methodAlias}`

`/api/{pluginAlias}/{entityALias}/{methodAlias}`

### Статические файлы

`/static/{pluginAlias}/{filePath}`

### Библиотеки от сторонних разработчиков

Суффикс `.min` в url не указываем.

`/vendor/js/{filePath}`
`/vendor/css/{filePath}`
`/vendor/fonts/{filePath}`

### Ядро веб-приложения

`/webapp/{filePath}`
