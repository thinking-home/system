define([
    'marionette',
    'backbone',
    'handlebars',
    'underscore',
    'jquery'
], function(marionette, backbone, handlebars, _, $) {

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
        _: _,
        $: $
    };
});
