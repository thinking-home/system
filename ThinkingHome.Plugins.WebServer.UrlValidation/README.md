*ThinkingHome.Plugins.WebServer.UrlValidation* 

[![NuGet Pre Release](https://img.shields.io/nuget/vpre/ThinkingHome.Plugins.WebServer.UrlValidation.svg)]()

# UrlValidationPlugin

Проверяет соответствие URL http-ресурсов подключенных плагинов правилам формирования URL. Список найденных ошибок доступен в веб-интерфейсе по адресу `/dynamic/web-server/url-validation/errors.txt`. 

## Правила формирования URL

### Plugin alias

В адресах используется значение `plugin alias` - это: 

- имя пакета 
- без префикса `ThinkingHome.Plugins.`;
- camelCase преобразуется в разделители - дефис `-`;  
- вместо точек разделитель - слэш `/`;
- в нижнем регистре.

`ThinkingHome.Plugins.MyPlugin.InnerPackage` => `my-plugin/inner-package`

### Методы API

`/api/{pluginAlias}/{methodAlias}`

`/api/{pluginAlias}/{entityALias}/{methodAlias}`

#### Генерируемые файлы

`/dynamic/{pluginAlias}/{methodAlias}.{ext}`

### Статические файлы

`/static/{pluginAlias}/{filePath}.{ext}`

### Библиотеки от сторонних разработчиков

Суффикс `.min` в url не указываем.

`/vendor/js/{filePath}.{ext}`
`/vendor/css/{filePath}.{ext}`
`/vendor/fonts/{filePath}.{ext}`
