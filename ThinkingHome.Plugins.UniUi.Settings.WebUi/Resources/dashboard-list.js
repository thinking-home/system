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
        this.listenTo(this.view, 'dashboard:create', this.bind('createDashboard'));
        this.application.setContentView(this.view);

        return this.loadDashboardList();
    },

    loadDashboardList: function() {
        return lib.ajax
            .loadModel('/api/uniui/settings/web-api/dashboard/list', lib.backbone.Collection)
            .then(this.bind('displayList'));
    },

    displayList: function (items) {
        var listView = new ListView({ collection: items });

        this.listenTo(listView, 'childview:dashboard:open', this.bind('openDashboard'));

        this.view.showChildView('list', listView);
    },

    createDashboard: function () {
        var title = window.prompt('Enter dashboard title');

        if (title) {
            lib.ajax
                .postJSON('/api/uniui/settings/web-api/dashboard/save', { title: title })
                .then(this.bind('loadDashboardList'))
                .catch(alert);
        }
    },

    openDashboard: function (view) {
        var dashboardId = view.model.get('id');
        this.application.navigate('/static/uniui/settings/web-ui/dashboard.js', dashboardId);
    }
});

module.exports = Section;
