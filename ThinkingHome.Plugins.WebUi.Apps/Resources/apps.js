var lib = require('lib');
var layoutTemplate = '<h1 class="js-title"></h1><div class="js-list"></div>';
var itemTemplate = '<a href="#" class="js-section-link">{{title}}</a>';

//#region entities

var SectionModel = lib.backbone.Model.extend({
    defaults: {
        sortOrder: 0
    }
});

var SectionCollection = lib.backbone.Collection.extend({
    model: SectionModel,
    comparator: 'sortOrder'
});

var loadSections = function (type) {
    return lib.$
        .getJSON('/api/webui/apps/list', { type: type })
        .then(function(list) { return new SectionCollection(list); });
};

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'li'
});

var ListView = lib.marionette.CollectionView.extend({
    childView: ItemView,
    tagName: 'ul'
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    regions: {
        list: '.js-list'
    },
    onRender: function() {
        this.$('.js-title').text(this.getOption('title'));
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function(type) {
        this.view = new LayoutView({
            title: type === 'system' ? 'Settings' : 'Applications'
        });
        this.application.setContentView(this.view);

        loadSections(type).then(
            this.bind('displayList'),
            function() { alert('error!'); });
    },
    displayList: function (items) {
        this.view.showChildView('list', new ListView({
            collection: items
        }));
    }
});

module.exports = Section;
