var lib = require('lib');
var lang = require('lang!static/cron/lang.json');

var itemTemplate =
    '<span class="th-cron-value">{{#isnull month}}*{{else}}{{month}}{{/isnull}}</span>:' +
    '<span class="th-cron-value">{{#isnull day}}*{{else}}{{day}}{{/isnull}}</span>:' +
    '<span class="th-cron-value">{{#isnull hour}}*{{else}}{{hour}}{{/isnull}}</span>:' +
    '<span class="th-cron-value">{{#isnull minute}}*{{else}}{{pad minute 2}}{{/isnull}}</span>' +
    '<a href="#" class="js-task-edit">{{name}}</a> {{#unless enabled}}{{lang \'disabled\'}}{{/unless}}';

var layoutTemplate = '<h1>{{lang \'Cron tasks\'}}</h1>' +
    '<p><a href="#" class="btn btn-secondary js-task-create">{{lang \'Create\'}}</a></p>' +
    '<div class="js-task-list"></div>';

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    templateContext: { lang: lang },
    className: 'th-list-item',
    tagName: 'li',
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
    templateContext: { lang: lang },
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
