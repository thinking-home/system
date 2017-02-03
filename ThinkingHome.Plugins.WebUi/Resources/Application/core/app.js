var lib = require('lib');
var layout = require('webapp/core/layout.js');

var welcomePage = require('welcome');

var homeApplication = lib.marionette.Application.extend({

    initialize: function(options) {
        this.layout = new layout();
    },

    onStart: function() {
        this.layout.render();

        var page = new welcomePage({ application: this });
        page.start();
    },

    onBeforeDestroy: function() {
        this.layout.destroy();
    },

    // api
    setContentView: function(view) {
        this.layout.setContentView(view);
    }
});

module.exports = homeApplication;
