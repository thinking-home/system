var lib = require('lib');
var errorTemplate = '<h1><i class="fa fa-times-circle fa-fw text-danger"></i> {{title}}</h1>' +
    '<p class="lead">{{message}}</p>';

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