var lib = require('lib');
var lang = require('lang!static/web-ui/lang.json');
var layoutTemplate = require('static/web-ui/layout.tpl');

var LayoutView = lib.marionette.View.extend({
    el: 'body',

    template: lib.handlebars.compile(layoutTemplate),

    templateContext: { lang: lang },

    regions: {
        content: '.js-content'
    },

    events: {
        'click .js-toggler': function() { this.toggleMenu(); },
        'click .js-nav-link': function() { this.toggleMenu(false); }
    },

    toggleMenu: function(enabled) {
        this.$('.js-menu').toggleClass('show', enabled);
    }
});

var Layout = lib.common.ApplicationBlock.extend({
    initialize: function() {
        this.view = new LayoutView();
    },
    render: function() {
        this.view.render();
    },
    onBeforeDestroy: function () {
        this.view.destroy();
    },

    // api
    setContentView: function(view) {
        this.view.showChildView('content', view);
    }
});

module.exports = Layout;
