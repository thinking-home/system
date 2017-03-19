var lib = require('lib');
var template = '<h1>Hi!</h1><p>This is tmp page.</p>';

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template)
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);
    }
});

module.exports = Section;
