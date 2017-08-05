var lib = require('lib');

var itemTemplate = '{{hours}}:{{pad minutes 2}} <a href="#" class="js-task-edit">{{name}}</a> {{#unless enabled}}disabled{{/unless}}';

var layoutTemplate = '<h1>Scheduler tasks</h1>' +
    '<p><a href="#" class="btn btn-secondary js-event-add">Create</a></p>' +
    '<div class="js-event-list"></div>';

//#region entities

var SchedulerEventModel = lib.backbone.Model.extend({});

var SchedulerEventCollection = lib.backbone.Collection.extend({
    model: SchedulerEventModel
});

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'li',
    className: 'th-list-item',
    triggers: {
        'click .js-task-edit': 'task:edit'
    }
});

var ListView = lib.marionette.CollectionView.extend({
    childView: ItemView,
    className: 'list-unstyled',
    tagName: 'ul'
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    regions: {
        list: '.js-event-list'
    },
    triggers: {
        'click .js-event-add': 'event:create'
    }
});

//#endregion


var Section = lib.common.AppSection.extend({
    start: function() {
        this.view = new LayoutView();
        this.listenTo(this.view, 'event:create', this.bind('addTask'));
        
        this.application.setContentView(this.view);

        return lib.ajax
            .loadModel('/api/scheduler/web-api/list', SchedulerEventCollection)
            .then(this.bind('displayList'));
    },

    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.listenTo(listView, 'childview:task:edit', this.bind('editTask'));
        this.view.showChildView('list', listView);
    },

    addTask: function () {
        this.application.navigate('/static/scheduler/web-ui/editor.js');
    },

    editTask: function (view) {
        var taskId = view.model.get('id');
        this.application.navigate('/static/scheduler/web-ui/editor.js', taskId);
    }
});

module.exports = Section;
