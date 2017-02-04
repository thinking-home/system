var lib = require('lib');
var layout = require('webapp/core/layout.js');
var router = require('webapp/core/router.js');

var welcomePage = require('welcome');

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

        var page = new welcomePage({ application: this });
        page.start();
    },

    onBeforeDestroy: function() {
        this.layout.destroy();
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
        console.log(route, args);
    }
});

module.exports = homeApplication;
