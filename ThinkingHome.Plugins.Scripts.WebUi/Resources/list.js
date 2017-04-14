var lib = require('lib');
var layoutTemplate = '<h1>Script list</h1><div class="js-script-list"></div>';
var itemTemplate = '<a href="#">{{name}}</a>';

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
    tagName: 'li'
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
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function() {
        this.view = new LayoutView();
        this.application.setContentView(this.view);

        api.loadScripts('/api/scripts/list').then(
            this.bind('displayList'),
            this.bind('displayError', 'Can\'t load script list'));
    },
    displayList: function (items) {
        var listView = new ListView({ collection: items });
        this.view.showChildView('list', listView);
    },
    displayError: function (title, error) {
        this.application.showError(title, error.message);
    }
});

module.exports = Section;
