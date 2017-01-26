define([
    'marionette',
    'backbone',
    'underscore',
    'handlebars',
    'jquery',
    'json2'
], function(marionette, backbone, underscore, handlebars, jquery, json2) {

    return {
        marionette: marionette,
        backbone: backbone,
        handlebars: handlebars,
        _: underscore,
        $: jquery,
        json2: json2
    };
});