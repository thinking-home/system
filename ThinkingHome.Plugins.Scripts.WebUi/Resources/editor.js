require('codemirror-javascript');
require('codemirror-fullscreen');

var lib = require('lib');
var codemirror = require('codemirror');
var lang = require('lang!static/scripts/web-ui/lang.json');
var template = require('static/scripts/web-ui/editor.tpl');

var EditorModel = lib.backbone.Model.extend({
    defaults: {
        body: ''
    }
});

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    templateContext: { lang: lang },
    onAttach: function() {
        var container = this.$('.js-script-body').get(0);
        var script = this.model.toJSON();

        this.cm = codemirror(container, {
            value: script.body,
            mode: 'javascript',
            theme: 'bootstrap',
            lineNumbers: true
        });

        this.$('.js-script-delete').toggleClass('d-none', !script.id);
    },
    getValue: function() {
        return this.cm && this.cm.getValue();
    },
    ui: {
        editorPanel: '.js-editor-panel',
        btnEnterFullscreen: '.js-enter-fullscreen',
        btnExitFullscreen: '.js-exit-fullscreen'
    },
    triggers: {
        'click .js-script-cancel': 'editor:cancel',
        'click .js-script-save': 'editor:save',
        'click .js-script-delete': 'editor:delete',
        'click @ui.btnEnterFullscreen': 'editor:fullscreen:enter',
        'click @ui.btnExitFullscreen': 'editor:fullscreen:exit'

    },
    toogleFuulscreen: function (flag) {
        flag === undefined && (flag = !this.cm.getOption('fullScreen'));

        this.cm.setOption('fullScreen', flag);
        this.ui.editorPanel.toggleClass('CodeMirror-panel-fullscreen', flag);
        this.ui.btnEnterFullscreen.toggleClass('d-none', flag);
        this.ui.btnExitFullscreen.toggleClass('d-none', !flag);
    },

    onEditorFullscreenEnter: function () {
        this.toogleFuulscreen(true);
    },
    onEditorFullscreenExit: function () {
        this.toogleFuulscreen(false);
    }
});

var Section = lib.common.AppSection.extend({

    start: function(scriptId) {

        return scriptId
            ? this.edit(scriptId)
            : this.add();
    },

    edit: function (scriptId) {
        return lib.ajax
            .loadModel('/api/scripts/web-api/get', { id: scriptId }, EditorModel)
            .then(this.bind('createEditor'));
    },

    add: function () {
        var name = window.prompt(lang.get('Enter script name'), '');
        var model = new EditorModel({ name: name || 'noname' });
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

        lib.ajax.postJSON('/api/scripts/web-api/save', data)
            .then(this.bind('redirectToList'), alert);
    },

    deleteScript: function(view) {
        var id = view.model.get('id');

        if (window.confirm(lang.get('The script will be deleted. Continue?'))) {
            lib.ajax.postJSON('/api/scripts/web-api/delete', { id: id })
                .then(this.bind('redirectToList'), alert);
        }
    }
});

module.exports = Section;
