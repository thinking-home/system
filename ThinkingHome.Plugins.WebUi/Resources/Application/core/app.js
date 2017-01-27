var lib = require('lib');
var layout = require('webapp/core/layout.js');

var homeApplication = lib.marionette.Application.extend({
    initialize: function(options) {
        this.layout = new layout();
    },
    onStart: function() {
        this.layout.render();
    },
    onBeforeDestroy: function() {
        this.layout.destroy();
    }
});

module.exports = homeApplication;
