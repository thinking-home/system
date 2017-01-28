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

    return {
        common: {
            ApplicationBlock: applicationBlock
        },
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        _: _,
        $: $
    };
});