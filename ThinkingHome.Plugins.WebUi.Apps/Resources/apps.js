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

var loadSections = function (url) {
    return lib.$.getJSON(url)
        .then(function(data) {
            return new SectionCollection(data);
        });
};

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'li',
    triggers: {
        'click .js-section-link': 'navigate'
    }
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
    title: 'Applications',
    url: '/api/webui/apps/user',
    start: function() {
        this.view = new LayoutView({
            title: this.getOption('title')
        });

        this.application.setContentView(this.view);

        loadSections(this.getOption('url')).then(
            this.bind('displayList'),
            function() { alert('error!'); });
    },
    displayList: function (items) {
        var listView = new ListView({ collection: items });
        this.listenTo(listView, "childview:navigate", this.bind('onSectionSelect'));

        this.view.showChildView('list', listView);
    },
    onSectionSelect: function(childView) {
        var url = childView.model.get('url');
        this.application.navigate(url);
    }
});

module.exports = Section;
