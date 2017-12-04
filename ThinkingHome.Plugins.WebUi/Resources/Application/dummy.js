var lib = require('lib');
var lang = require('lang!static/web-ui/lang.json');
var template = require('static/web-ui/dummy.tpl');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    templateContext: { lang: lang }
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);

        console.log(arguments);
    }
});

module.exports = Section;
