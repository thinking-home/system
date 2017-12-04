define([
    'marionette',
    'backbone',
    'syphon',
    'handlebars',
    'moment',
    'underscore',
    'jquery',
    'signalr-client'
], function(marionette, backbone, syphon, handlebars, moment, _, $, signalrClient) {

    var applicationBlock = marionette.Object.extend({
        bind: function (fn) {
            var func = _.isString(fn) ? this[fn] : fn,
                args = [].slice.call(arguments, 1),
                ctx = this;

            return function () {
                return func.apply(ctx, args.concat([].slice.call(arguments)));
            };
        }
    });

    var appSection = applicationBlock.extend({
        initialize: function (options) {
            this.application = options.application;
        },
        start: function () { }
    });

    var stringLocalizer = function(data) {
        !data && (data = {});

        this.culture = data.culture;
        this.data = data.values;
    };

    stringLocalizer.prototype.get = function(key) {
        return (this.data && this.data[key]) || key;
    };

    stringLocalizer.prototype.moment = function() {
        return moment
            .apply(this, arguments)
            .locale(String(this.culture));
    };

    //region ajax


    /**
     * Загружает JSON с указанного URL с обработкой ошибок
     * @param {String} url Url, по которому находятся данные
     * @param {Object} [data] Параметры запроса
     * @returns {Promise}
     */
    var getJSON = function(url, data) {

        return $.getJSON(url, data).catch(function() {
            throw new Error('Can\'t load url: ' + url);
        });
    };

    /**
     * Загружает JSON с указанного URL с обработкой ошибок
     * @param {String} url Url, по которому находятся данные
     * @param {Object} [data] Параметры запроса
     * @returns {Promise}
     */
    var postJSON = function(url, data) {

        return $.post(url, data).catch(function() {
            throw new Error('Request failed: ' + url);
        });
    };

    /**
     * Загружает данные в указанного url и создает экземпляр модели.
     * @param {String} url Url, по которому находятся данные
     * @param {Object} [data] Параметры запроса
     * @param {Model} [fn] Конструктор модели
     * @returns {Promise}
     */
    var loadModel = function(url, data, fn) {
        typeof data === 'function' && (fn = data, data = undefined);

        var Model = fn || backbone.Model;

        return getJSON(url, data)
            .then(function(data) {
                return new Model(data);
            });
    };

    //endregion

    //region form

    /**
     * @param {jQuery} select выпадающий список
     * @param {Collection} collection коллекция элементов
     * @param {Object} [options] дополнительные параметры
     * @param {String} [options.textField] название поля, содержащего название элемента (по умолчанию 'name')
     * @param {String} [options.valueField] название поля, содержащего id элемента (по умолчанию 'id')
     * @returns {jQuery}
    */
    var setOptions = function(select, collection, options) {
        !options && (options = {});

        var textField = options.textField || 'name';
        var valueField = options.valueField || 'id';

        select.empty();

        collection.each(function(item) {
            var val = item.get(valueField),
                text = item.get(textField);

            $('<option />').val(val).text(text).appendTo(select);
        });

        return select;
    };

    //endregion

    //region handlebars helpers
    handlebars.default.registerHelper('range', function (from, to, incr, options) {

        var out = '', i;

        for (i = from; i <= to; i += incr) {

            out += options.fn(i);
        }

        return out;
    });

    handlebars.default.registerHelper('pad', function (value, length) {
        value = value + '';
        length = length || 0;

        return (new Array(length + 1).join('0') + value).slice(-length);
    });

    handlebars.default.registerHelper('isnull', function(variable, options) {
        if (variable === null) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    handlebars.default.registerHelper('lang', function (key) {
        return this.lang instanceof stringLocalizer ? this.lang.get(key) : key;
    });

    //endregion

    return {
        common: {
            ApplicationBlock: applicationBlock,
            AppSection: appSection,
            StringLocalizer: stringLocalizer
        },
        form: {
            setOptions: setOptions
        },
        ajax: {
            loadModel: loadModel,
            getJSON: getJSON,
            postJSON: postJSON
        },
        marionette: marionette,
        backbone: backbone,
        syphon: syphon,
        handlebars: handlebars,
        moment: moment,
        _: _,
        $: $,
        signalrClient: signalrClient
    };
});
