var lib = require('lib');
var template = require('/static/scheduler/web-ui/editor.tpl');

var EditorModel = lib.backbone.Model.extend();

var View = lib.marionette.View.extend({
    template: lib.handlebars.compile(template),
    onRender: function () {

        // get data from model
        var data = this.serializeData();
        
        // set selected values
        lib.syphon.deserialize(this, data);
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
        this.application.setContentView(view);
    }
});

module.exports = Section;