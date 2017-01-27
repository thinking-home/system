define([
    'marionette',
    'backbone',
    'underscore',
    'handlebars',
    'jquery'
], function(marionette, backbone, underscore, handlebars, jquery) {

    return {
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        _: underscore,
        $: jquery
    };
});