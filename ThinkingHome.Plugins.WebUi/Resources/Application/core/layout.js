var lib = require('lib');
var layoutTemplate = require('webapp/core/layout.tpl');

var layoutView = lib.marionette.View.extend({
    el: 'body',
    template: lib.handlebars.compile(layoutTemplate)
});

var Layout = lib.common.ApplicationBlock.extend({
    initialize: function() {
        this.view = new layoutView();
    },
    render: function() {
        this.view.render();
    },
    onBeforeDestroy: function () {
        this.view.destroy();
    }
});

module.exports = Layout;
