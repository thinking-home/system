var lib = require('lib');
var template = require('template!static/web-ui/dummy.tpl');

var View = lib.marionette.View.extend({
    template: template
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);

        console.log(arguments);
    }
});

module.exports = Section;
