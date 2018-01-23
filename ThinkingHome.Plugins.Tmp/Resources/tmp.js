var lib = require('lib');
var template = require('static/tmp/tmp.tpl');
var lang = require('lang!static/tmp/lang.json');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    templateContext: { lang: lang }
});

var Section = lib.common.AppSection.extend({
    start: function() {
        var view = new View();
        this.application.setContentView(view);

        console.log(lang.moment(1316116057189).fromNow());

        //return lib.ajax.getJSON('/qwdqwkfqwgqwgqwgqwgqwg');
    }
});

module.exports = Section;
