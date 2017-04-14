var lib = require('lib');
var template = '<h1>Script editor</h1>';

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template)
});

var Section = lib.common.AppSection.extend({
    start: function(scriptId) {
        var view = new View();
        this.application.setContentView(view);
        alert(scriptId);
    }
});

module.exports = Section;
