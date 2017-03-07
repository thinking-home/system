*ThinkingHome.Plugins.WebUi*

# WebUiPlugin

Реализует инфраструктуру веб-интерфейса системы.

Технически, веб-интерфейс представляет собой модульное одностраничное приложение на основе [marionette.js](https://marionettejs.com). Загрузка модулей происходит по мере необходимости с помощью [systemjs](https://github.com/systemjs/systemjs). Также в интерфейсе доступны [Twitter Bootstrap](https://v4-alpha.getbootstrap.com) и [Font Awesome](http://fontawesome.io).

## Конфигурация

В разделе `pages` вы можете настроить, какие страницы использовать в качестве главной страницы приложения (параметр `pages:welcome`) и страницы списка разделов приложения (параметр `pages:apps`). По умолчанию используется страница-заглушка `/webapp/dummy.js`.

```js
{
    "plugins": {

        ...

        "ThinkingHome.Plugins.WebUi.WebUiPlugin": {
            "pages": {
                "welcome": "/webapp/dummy.js",
                "apps": "/webapp/dummy.js"
            }
        }
    }
}
```

## API

### `[JavaScriptResource]`

С помощью атрибута `ThinkingHome.Plugins.WebUi.Attributes.JavaScriptResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл JavaScript из ресурсов. Атрибутом необходимо отметить класс вашего плагина. 

В параметрах атрибута нужно указать: URL относительно корневого адреса и путь к файлу в ресурсах DLL. Также вы можете задать дополнительные параметр `Alias` - имя, по которому можно будет обращаться к файлу в [модульной системе](#Модульная-система). 

#### Пример

```csharp
[JavaScriptResource("/webui/my-page.js", "MyPlugin.Resources.my-page.js")]
public class MyPlugin : PluginBase
{

}
```

### `[CssResource]`

С помощью атрибута `ThinkingHome.Plugins.WebUi.Attributes.CssResourceAttribute` вы можете настроить, чтобы по заданному URL на клиент возвращался заданный файл CSS из ресурсов. Атрибутом необходимо отметить класс вашего плагина. 

```csharp
[CssResourceAttribute("/webui/my-page.css", "MyPlugin.Resources.my-page.css")]
public class MyPlugin : PluginBase
{

}
```

## Клиентская инфраструктура

### Модульная система

В основе инфраструктуры веб-интерфейса лежит модульная система (используется библиотека [systemjs](https://github.com/systemjs/systemjs)). Все js файлы, кроме файла `/webapp/index.js` (точка входа приложения), загружаются через модульную систему. Внутри своих модулей вы можете запрашивать другие модули, используя любой синтаксис, поддерживаемый библиотекой *systemjs* (например, AMD или requirejs).

Помните, что для возможности использования вашего модуля в приложении его необходимо поместить в ресурсы DLL. Также добавить плагину, к которому относится модуль, атрибут `[JavaScriptResource]`, указывающий URL для вашего модуля.

### Общие модули

В системе доступен специальный модуль `lib`, предоставляющий доступ к библиотекам общего назначения.

```js
var lib = require('lib');

// lib.$: jQUery v3 http://jquery.com
// lib.marionette - marionette v3 js https://marionettejs.com
// lib.backbone - backbone.js http://backbonejs.org
// lib._: underscore.js http://underscorejs.org
// lib.handlebars - шаблонизатор http://handlebarsjs.com
// lib.moment - API для работы с датами и временем https://momentjs.com
```

### Добавление разделов в веб-интерфейс

Любая страница веб-интерфейса системы – это небольшая программа на языке JavaScript. Она описывает, что именно должен видеть пользователь на экране и какие действия должны быть выполнены, когда пользователь взаимодействует с элементами интерфейса. Как и остальной код приложения, разделы загружаются через systemjs.

Чтобы модуль вашего раздела мог быть использован веб-интерфейсом, необходимо, унаследовать его (с помощью функции `extend`) от объекта `AppSection` из модуля `lib.common`. 

```js
var lib = require('lib');

var Section = lib.common.AppSection.extend({
    start: function() {
        // метод start выполняется, когда пользователь преходит в ваш раздел
        lib.$('body').html('Hello world!');
    }
});

module.exports = Section;
```

### Отображение содержимого страницы

в прототипе `lib.common.AppSection` доступен метод `this.application.setContentView`, в который вы можете передать представление (marionette view) и оно будет добавлено на страницу 

сохраняйте шаблоны с расширением `.tpl` и запрашивайте как модули (получите строку с содержимым файла) 

#### Пример

```js
var lib = require('lib');
var template = require('webui/my-template.tpl');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template)
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);
    }
});

module.exports = Section;
```

### Навигация и роутинг

обрабатываются пути, указанные после решетки
после пути можно указать `?` и аргументы, разделенные слэшами - они будут переданы в метод `start`

для перехода в другой раздел используйте `this.application.navigate(path, arg1, arg2, ...)`
