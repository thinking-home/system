require('codemirror-javascript');

var lib = require('lib');
var codemirror = require('codemirror');
var template = require('/static/scripts/web-ui/editor.tpl');

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
        if (scriptId) {
            this.edit(scriptId);
        } else {
            this.add();
        }
    },

    edit: function (scriptId) {
        lib.common
            .loadModel('/api/scripts/web-api/get', { id: scriptId })
            .then(this.bind('createEditor'), this.bind('displayError'));
    },

    add: function () {
        var name = window.prompt('Enter script name', '');
        var model = new lib.backbone.Model({ name: name || 'noname' });
        this.createEditor(model);
    },

    createEditor: function (model) {
        var view = new View({ model: model });

        this.listenTo(view, 'scripts:editor:cancel', this.bind('redirectToList'));
        this.listenTo(view, 'scripts:editor:save', this.bind('save', view));

        this.application.setContentView(view);
    },

    displayError: function (error) {
        this.application.showError('Can\'t load script', error.message);
    }
});

module.exports = Section;
