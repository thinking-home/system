var lib = require('lib');
var template = require('/static/scheduler/web-ui/editor.tpl');

var EditorModel = lib.backbone.Model.extend({
    defaults: {
        enabled: true
    }
});

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    onRender: function () {

        // get data from model
        var data = this.serializeData();
        
        // set selected values
        lib.syphon.deserialize(this, data);

        this.$('.js-btn-delete').toggleClass('d-none', !data.id);
    },
    onEditorSave: function () {
        var data = lib.syphon.serialize(this);
        this.model.set(data);
    },
    triggers: {
        'click .js-btn-save': 'editor:save',
        'click .js-btn-cancel': 'editor:cancel',
        'click .js-btn-delete': 'editor:delete'
    }
});

var Section = lib.common.AppSection.extend({

    start: function (taskId) {

        return taskId
            ? this.edit(taskId)
            : this.add();
    },

    edit: function (taskId) {
        return lib.ajax
            .loadModel('/api/scheduler/web-api/get', { id: taskId }, EditorModel)
            .then(this.bind('createEditor'));
    },

    add: function () {
        var model = new EditorModel();
        this.createEditor(model);
    },

    createEditor: function (model) {
        var view = new View({ model: model });

        this.listenTo(view, 'editor:save', this.bind('saveTask', view));
        this.listenTo(view, 'editor:cancel', this.bind('redirectToList'));
        this.listenTo(view, 'editor:delete', this.bind('deleteTask', view));
        
        this.application.setContentView(view);
    },

    saveTask: function (view) {
        var data = view.model.toJSON();

        lib.ajax.postJSON('/api/scheduler/web-api/save', data)
            .then(this.bind('redirectToList'), alert);    
    },

    redirectToList: function () {
        this.application.navigate('/static/scheduler/web-ui/list.js');    
    },

    deleteTask: function (view) {
        var id = view.model.get('id');

        if (window.confirm('This task will be deleted. Continue?')) {
            lib.ajax.postJSON('/api/scheduler/web-api/delete', { id: id })
                .then(this.bind('redirectToList'), alert);
        }    
    }
});

module.exports = Section;