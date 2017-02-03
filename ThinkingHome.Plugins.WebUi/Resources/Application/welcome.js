var lib = require('lib');

var welcomeView = lib.marionette.View.extend({
    template: lib.handlebars.compile('<h1>Welcome to home!</h1>')
});

var welcomePage = lib.common.Page.extend({
    start: function() {
        var view = new welcomeView();

        this.application.setContentView(view);
    }
});

module.exports = welcomePage;
