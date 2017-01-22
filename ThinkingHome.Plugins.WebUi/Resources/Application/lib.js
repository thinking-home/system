define([
    'marionette',
    'backbone',
    'underscore',
    'jquery',
    'json2'
], function(marionette, backbone, underscore, jquery, json2) {

    return {
        marionette: marionette,
        backbone: backbone,
        _: underscore,
        $: jquery,
        json2: json2
    };
});