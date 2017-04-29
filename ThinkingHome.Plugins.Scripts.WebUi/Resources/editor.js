require('codemirror-javascript');

var lib = require('lib');
var codemirror = require('codemirror');
var template = require('/static/scripts/web-ui/editor.tpl');

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    onAttach: function() {
        var container = this.$('.js-script-body').get(0);
        var value = this.model.get('body');

        this.cm = codemirror(container, {
            value: value,
            mode: 'javascript',
            theme: 'bootstrap',
            lineNumbers: true
        });
    },
    getValue: function() {
        return this.cm && this.cm.getValue();
    },
    triggers: {
        'click .js-script-cancel': 'editor:cancel',
        'click .js-script-save': 'editor:save',
        'click .js-script-delete': 'editor:delete'
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

        this.listenTo(view, 'editor:cancel', this.bind('redirectToList'));
        this.listenTo(view, 'editor:save', this.bind('saveScript', view));
        this.listenTo(view, 'editor:delete', this.bind('deleteScript', view));

        this.application.setContentView(view);
    },

    redirectToList: function() {
        this.application.navigate('/static/scripts/web-ui/list.js');
    },

    saveScript: function(view) {
        var data = view.model.toJSON();
        data.body = view.getValue();

        lib.$.post('/api/scripts/web-api/save', data)
            .then(this.bind('redirectToList'), this.bind('displayError'));
    },

    deleteScript: function(view) {
        alert('delete');
    },

    displayError: function (error) {
        this.application.showErrorPage('Can\'t load script', error.message);
    }
});

module.exports = Section;
