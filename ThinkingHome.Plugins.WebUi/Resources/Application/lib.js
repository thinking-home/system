define([
    'marionette',
    'backbone',
    'handlebars',
    'moment',
    'underscore',
    'jquery'
], function(marionette, backbone, handlebars, moment, _, $) {

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

    /**
     * Сериализует форму в json (для полей с одинаковым именем берется значение последнего)
     * @param {jQuery} form форма
     * @returns {Object}
     */
    var serializeForm = function(form) {
        return form.serializeArray().reduce(function(obj, el) {
            obj[el.name] = el.value;
            return obj;
        }, {});
    };

    return {
        common: {
            ApplicationBlock: applicationBlock,
            AppSection: appSection,
            getJSON: getJSON,
            serializeForm: serializeForm
        },
        ajax: {
            loadModel: loadModel,
            getJSON: getJSON,
            postJSON: postJSON
        },
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        moment: moment,
        _: _,
        $: $
    };
});
