var lib = require('lib');
var itemTemplate = '<a href="#" class="js-script-edit">{{name}}</a>';
var layoutTemplate = '<h1>Script list</h1>' +
    '<p><a href="#" class="btn btn-secondary js-script-add">Create</a></p>' +
    '<div class="js-script-list"></div>';

//#region entities

var ScriptModel = lib.backbone.Model.extend({});

var ScriptCollection = lib.backbone.Collection.extend({
    model: ScriptModel
});

var api = {
    loadScripts: function (url) {
        return lib.$.getJSON(url)
            .then(
                function(data) { return new ScriptCollection(data) },
                function() { throw new Error('Can\'t load url: ' + url) });
    }
};

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'li',
    triggers: {
        'click .js-script-edit': 'scripts:edit'
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
        list: '.js-script-list'
    },
    triggers: {
        'click .js-script-add': 'scripts:create'
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function() {
        this.view = new LayoutView();
        this.listenTo(this.view, 'scripts:create', this.bind('addScript'));

        this.application.setContentView(this.view);

        api.loadScripts('/api/scripts/web-api/list').then(
            this.bind('displayList'),
            this.bind('displayError', 'Can\'t load script list'));
    },
    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.listenTo(listView, 'childview:scripts:edit', this.bind('editScript'));
        this.view.showChildView('list', listView);
    },
    displayError: function (title, error) {
        this.application.showError(title, error.message);
    },

    addScript: function () {
        this.application.navigate('/static/scripts/web-ui/editor.js');
    },

    editScript: function (view) {
        var scriptId = view.model.get('id');
        this.application.navigate('/static/scripts/web-ui/editor.js', scriptId);
    }
});

module.exports = Section;
