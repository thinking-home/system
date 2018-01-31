var lib = require('lib');

var layoutTemplate = require('static/uniui/settings/web-ui/dashboard-list.tpl');
var itemTemplate = require('static/uniui/settings/web-ui/dashboard-list-item.tpl');

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    //templateContext: { lang: lang },
    className: 'th-list-item',
    tagName: 'li',
    triggers: {
        'click .js-open-dashboard': 'dashboard:open'
    }
});

var ListView = lib.marionette.CollectionView.extend({
    childView: ItemView,
    className: 'list-unstyled',
    tagName: 'ul'
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    // templateContext: { lang: lang },
    regions: {
        list: '.js-list'
    },
    triggers: {
        'click .js-create-dashboard': 'dashboard:create'
    }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function() {
        this.view = new LayoutView();

        this.application.setContentView(this.view);

        return lib.ajax
            .loadModel('/api/uniui/settings/web-api/dashboard/list', lib.backbone.Collection)
            .then(this.bind('displayList'));
    },

    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.view.showChildView('list', listView);
    }
});

module.exports = Section;
