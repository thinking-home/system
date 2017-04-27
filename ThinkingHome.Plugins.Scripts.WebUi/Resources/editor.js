require('codemirror-javascript');

var lib = require('lib');
var codemirror = require('codemirror');
var template = '<h1>Script editor</h1>' +
    '<div class="row"><div class="col-md-8">' +
    '<p>' +
    '<a href="#" class="btn btn-primary js-script-save">Save</a> ' +
    '<a href="#" class="btn btn-secondary js-script-cancel">Cancel</a>' +
    '<a href="#" class="btn btn-danger float-right js-script-delete">Delete</a></p>' +
    '<textarea class="js-script-body">{{body}}</textarea>' +
    '</div></div>';


var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    onAttach: function() {
        var textarea = this.$('.js-script-body').get(0);

        this.cm = codemirror.fromTextArea(textarea, {
            mode: 'javascript',
            theme: 'bootstrap',
            lineNumbers: true
        });
    }
});

var Section = lib.common.AppSection.extend({
    start: function(scriptId) {
        var promise = scriptId
            ? lib.common.loadModel('/api/scripts/web-api/get', { id: scriptId })
            : Promise.resolve(new lib.backbone.Model());

        promise.then(
            this.bind('displayList'),
            this.bind('displayError', 'Can\'t load script'));
    },
    displayList: function (model) {
        var view = new View({ model: model });
        this.application.setContentView(view);
    },
    displayError: function (title, error) {
        this.application.showError(title, error.message);
    }
});

module.exports = Section;
