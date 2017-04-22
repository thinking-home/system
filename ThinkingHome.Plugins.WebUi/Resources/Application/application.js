var lib = require('lib');
var router = require('static/web-ui/router.js');
var layout = require('static/web-ui/layout.js');

var homeApplication = lib.marionette.Application.extend({

    initialize: function(options) {
        this.layout = new layout();
        this.layout.on('navigate', this._loadPage, this);

        this.router = new router();
        this.router.on('navigate', this._loadPage, this);
    },

    onStart: function() {
        this.layout.render();
        this.router.start();
    },

    onBeforeDestroy: function() {
        this.layout.destroy();
    },

    // api
    setContentView: function(view) {
        this.layout.setContentView(view);
    },

    showError: function(title, message) {
        this.layout.showError(title, message);
    },

    navigate: function (route) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._loadPage(route, args);
    },

    // private
    _loadPage: function(route, args) {
        var self = this;

        route = route || 'welcome';
        args = args || [];

        SystemJS.import(route).then(function(appSection) {
            self.appSection && self.appSection.destroy();

            var instance = self.appSection = new appSection({ application: self });
            instance.start.apply(instance, args);
            self.router.setPath(route, args);
        }).catch(function(err) {
            self.showError('Can\'t load section', err);
        });
    }
});

module.exports = homeApplication;
