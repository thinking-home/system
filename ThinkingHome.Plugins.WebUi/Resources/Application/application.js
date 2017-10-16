var lib = require('lib');
var router = require('static/web-ui/router.js');
var radio = require('static/web-ui/radio.js');
var layout = require('static/web-ui/layout.js');
var errors = require('static/web-ui/errors.js');

var homeApplication = lib.marionette.Application.extend({

    initialize: function(options) {
        this.layout = new layout();
        this.layout.on('navigate', this._loadPage, this);

        this.router = new router();
        this.router.on('navigate', this._loadPage, this);

        this.radio = new radio(options.radio);
    },

    onStart: function() {
        this.layout.render();
        this.router.start();
        this.radio.start();
    },

    onBeforeDestroy: function() {
        this.layout.destroy();
        this.radio.destroy();
    },

    // api
    setContentView: function(view) {
        this.layout.setContentView(view);
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

        SystemJS.import(route)
            .then(function(appSection) {
                self.appSection && self.appSection.destroy();

                self.router.setPath(route, args);

                var instance = self.appSection = new appSection({ application: self });

                return instance.start.apply(instance, args);
            })
            .catch(function(error) {
                // show error page
                self.setContentView(new errors.ErrorView({
                    title: 'Can\'t load section',
                    message: error
                }));
            });
    }
});

module.exports = homeApplication;
