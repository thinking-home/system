var lib = require('lib');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile('Welcome home!'),
    tagName: 'h1'
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);

        console.log(arguments);
    }
});

module.exports = Section;
