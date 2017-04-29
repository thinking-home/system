var lib = require('lib');
var layoutTemplate = '<h1 class="js-title"></h1><div class="js-list"></div>';
var itemTemplate = '<i class="fa fa-fw fa-{{icon}}"></i> <a href="#" class="js-section-link">{{title}}</a>';

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

//#endregion

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    tagName: 'li',
    className: 'th-app-list-item',
    triggers: {
        'click .js-section-link': 'navigate'
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
        list: '.js-list'
    },
    onRender: function() {
        this.$('.js-title').text(this.getOption('title'));
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    title: 'Applications',
    url: '/api/web-ui/apps/user',
    start: function() {
        this.view = new LayoutView({
            title: this.getOption('title')
        });

        this.application.setContentView(this.view);

        lib.common.loadModel(this.getOption('url'), SectionCollection).then(
            this.bind('displayList'),
            this.bind('displayError', 'Can\'t load app list'));
    },
    displayList: function (items) {
        var listView = new ListView({ collection: items });
        this.listenTo(listView, "childview:navigate", this.bind('onSectionSelect'));

        this.view.showChildView('list', listView);
    },
    displayError: function (title, error) {
        this.application.showErrorPage(title, error.message);
    },
    onSectionSelect: function(childView) {
        var url = childView.model.get('url');
        this.application.navigate(url);
    }
});

module.exports = Section;
