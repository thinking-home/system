var lib = require('lib');

var welcomeView = lib.marionette.View.extend({
    template: lib.handlebars.compile('<h1>Welcome home!</h1>')
});

var welcomeSection = lib.common.AppSection.extend({
    start: function() {
        var view = new welcomeView();

        this.application.setContentView(view);
    }
});

module.exports = welcomeSection;
