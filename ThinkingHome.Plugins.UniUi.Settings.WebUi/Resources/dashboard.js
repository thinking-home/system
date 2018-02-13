var lib = require('lib');

var layoutTemplate = require('static/uniui/settings/web-ui/dashboard.tpl');
var itemTemplate = require('static/uniui/settings/web-ui/dashboard-item.tpl');

//#region views

var ItemView = lib.marionette.View.extend({
    template: lib.handlebars.compile(itemTemplate),
    //templateContext: { lang: lang },
    triggers: { }
});

var ListView = lib.marionette.CollectionView.extend({
    childView: ItemView
});

var LayoutView = lib.marionette.View.extend({
    template: lib.handlebars.compile(layoutTemplate),
    // templateContext: { lang: lang },
    regions: {
        list: '.js-list'
    },
    triggers: { }
});

//#endregion

var Section = lib.common.AppSection.extend({
    start: function(dashboardId) {
        this.view = new LayoutView();
        this.application.setContentView(this.view);

        return this.loadPanelList(dashboardId);
    },

    loadPanelList: function() {
        return Promise.resolve(new lib.backbone.Collection([
            { title: 'moo 1' },
            { title: 'moo 2' },
            { title: 'moo 3' },
            { title: 'moo 4' },
            { title: 'moo 5' }
        ])).then(this.bind('displayList'));;
    },

    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.view.showChildView('list', listView);
    }
});

module.exports = Section;