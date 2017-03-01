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

    return {
        common: {
            ApplicationBlock: applicationBlock,
            AppSection: appSection
        },
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        moment: moment,
        _: _,
        $: $
    };
});
