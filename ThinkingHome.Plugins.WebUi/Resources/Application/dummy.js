var lib = require('lib');
var template = require('static/web-ui/dummy.tpl');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template)
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);

        console.log(arguments);
    }
});

module.exports = Section;
