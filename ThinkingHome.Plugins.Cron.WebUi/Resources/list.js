var lib = require('lib');

var itemTemplate = '{{hours}}:{{pad minutes 2}} <a href="#" class="js-task-edit">{{name}}</a> {{#unless enabled}}disabled{{/unless}}';

var layoutTemplate = '<h1>Cron tasks</h1>' +
    '<p><a href="#" class="btn btn-secondary js-task-create">Create</a></p>' +
    '<div class="js-task-list"></div>';

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
        list: '.js-task-list'
    },
    triggers: {
        'click .js-task-create': 'task:create'
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function() {
        this.view = new LayoutView();
        this.listenTo(this.view, 'task:create', this.bind('createTask'));
        
        this.application.setContentView(this.view);

        return lib.ajax
            .loadModel('/api/cron/web-api/list', lib.backbone.Collection)
            .then(this.bind('displayList'));
    },

    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.listenTo(listView, 'childview:task:edit', this.bind('editTask'));
        this.view.showChildView('list', listView);
    },

    createTask: function () {
        this.application.navigate('/static/cron/web-ui/editor.js');
    },

    editTask: function (view) {
        var taskId = view.model.get('id');
        this.application.navigate('/static/cron/web-ui/editor.js', taskId);
    }
});

module.exports = Section;
