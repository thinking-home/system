var lib = require('lib');
var errorTemplate = require('static/web-ui/error.tpl');

var ErrorView = lib.marionette.View.extend({
    className: 'th-error',
    template: lib.handlebars.compile(errorTemplate),
    templateContext: function() {
        return {
            title: this.getOption('title'),
            message: this.getOption('message')
        }
    }
});

module.exports = {
    ErrorView: ErrorView
};